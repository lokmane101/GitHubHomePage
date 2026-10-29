"""Check this static portfolio's local references without third-party packages."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import struct
import sys

ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
        self.errors = []
        self.h1_count = 0
        self.html_count = 0
        self.stack = []
        self.id_references = []
        self.png_images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        line = self.getpos()[0]
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append((tag, line))
        if tag == "html":
            self.html_count += 1
            if not attrs.get("lang"):
                self.errors.append(f"index.html:{line}: document language missing")
        if tag == "h1":
            self.h1_count += 1
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.errors.append(f"index.html:{line}: duplicate id {attrs['id']}")
            self.ids.add(attrs["id"])
        if tag == "img":
            for key in ("alt", "width", "height"):
                if key not in attrs:
                    self.errors.append(f"index.html:{line}: image lacks {key}")
            if urlsplit(attrs.get("src", "")).path.lower().endswith(".png"):
                self.png_images.append((attrs, line))
        for key in ("aria-labelledby", "aria-describedby", "aria-controls"):
            self.id_references.extend((reference, line) for reference in attrs.get(key, "").split())
        for key in ("src", "href"):
            if attrs.get(key):
                self.references.append((attrs[key], line))
        if attrs.get("target") == "_blank" and "noopener" not in attrs.get("rel", "").split():
            self.errors.append(f"index.html:{line}: new-tab link lacks noopener")

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            self.errors.append(f"index.html:{self.getpos()[0]}: unexpected closing tag </{tag}>")


def exact_file(path):
    """Windows is case-insensitive; deployment may not be."""
    try:
        parts = path.relative_to(ROOT).parts
    except ValueError:
        return False
    current = ROOT
    for part in parts:
        if not current.is_dir() or part not in {entry.name for entry in current.iterdir()}:
            return False
        current /= part
    return current.is_file()


def main():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    parser = SiteParser()
    parser.feed(html)
    errors = parser.errors
    if parser.html_count != 1 or html.lower().count("<!doctype html>") != 1:
        errors.append("index.html: expected exactly one HTML document and doctype")
    if parser.h1_count != 1:
        errors.append("index.html: expected one primary heading")
    if parser.stack:
        errors.append(f"index.html: unclosed elements: {parser.stack}")
    for reference, line in parser.id_references:
        if reference not in parser.ids:
            errors.append(f"index.html:{line}: missing ARIA target #{reference}")
    for value, line in parser.references:
        url = urlsplit(value)
        if url.scheme or url.netloc:
            continue
        if url.path and not exact_file((ROOT / unquote(url.path).lstrip("/")).resolve()):
            errors.append(f"index.html:{line}: local file missing or casing differs: {url.path}")
        if url.fragment and (not url.path or url.path == "index.html") and unquote(url.fragment) not in parser.ids:
            errors.append(f"index.html:{line}: missing anchor #{url.fragment}")
    for attrs, line in parser.png_images:
        file = ROOT / unquote(urlsplit(attrs["src"]).path)
        if not file.is_file():
            continue
        data = file.read_bytes()[:24]
        if data[:8] != b"\x89PNG\r\n\x1a\n":
            errors.append(f"index.html:{line}: file is not a PNG: {file.name}")
            continue
        width, height = struct.unpack(">II", data[16:24])
        if attrs.get("width") and attrs.get("height"):
            reserved_ratio = float(attrs["width"]) / float(attrs["height"])
            if abs(reserved_ratio / (width / height) - 1) > .01:
                errors.append(f"index.html:{line}: reserved PNG aspect ratio differs from source: {file.name}")
    css_path = ROOT / "css/style.css"
    for value in re.findall(r"url\(\s*['\"]?([^'\")\s]+)", css_path.read_text(encoding="utf-8")):
        if not urlsplit(value).scheme and not exact_file((css_path.parent / unquote(value)).resolve()):
            errors.append(f"css/style.css: local asset missing or casing differs: {value}")
    manifest_file = ROOT / "img/favicon/site.webmanifest"
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    for icon in manifest.get("icons", []):
        if not exact_file((manifest_file.parent / icon["src"]).resolve()):
            errors.append(f"site.webmanifest: icon is missing: {icon['src']}")
    if errors:
        print("\n".join(errors))
        return 1
    print(f"PASS: {len(parser.references)} references, {len(parser.ids)} unique IDs, image attributes and local CSS assets.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
