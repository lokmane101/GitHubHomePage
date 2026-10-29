'use strict';

document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const mobileViewport = window.matchMedia('(max-width: 700px)');

function setMenuOpen(open, returnFocus = false) {
  if (!menuToggle || !navMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  navMenu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (returnFocus) menuToggle.focus();
}

if (menuToggle && navMenu) {
  menuToggle.hidden = false;
  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navMenu.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !mobileViewport.matches) return;
    const target = link.hash && document.getElementById(link.hash.slice(1));
    setMenuOpen(false);
    // Keep keyboard focus on the destination after its navigation link is hidden.
    if (target && link.origin === location.origin && link.pathname === location.pathname) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener('click', (event) => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.nav')) {
      setMenuOpen(false, true);
    }
  });

  // Keep the keyboard within the expanded mobile navigation until it is closed.
  navMenu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !mobileViewport.matches || menuToggle.getAttribute('aria-expanded') !== 'true') return;
    const links = [...navMenu.querySelectorAll('a')];
    if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault();
      menuToggle.focus();
    }
  });
  menuToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && event.shiftKey && mobileViewport.matches && menuToggle.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      navMenu.querySelector('a:last-child').focus();
    }
  });

  mobileViewport.addEventListener('change', () => setMenuOpen(false));
}

const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);

function updateCurrentSection() {
  const headerOffset = document.querySelector('.site-header')?.offsetHeight ?? 88;
  let currentId = '';
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= headerOffset + 140) currentId = section.id;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) currentId = 'contact';
  navLinks.forEach(link => {
    if (link.hash === `#${currentId}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

let scrollFramePending = false;
window.addEventListener('scroll', () => {
  if (scrollFramePending) return;
  scrollFramePending = true;
  window.requestAnimationFrame(() => {
    updateCurrentSection();
    scrollFramePending = false;
  });
}, { passive: true });
window.addEventListener('resize', updateCurrentSection);
window.addEventListener('load', updateCurrentSection);
window.addEventListener('hashchange', updateCurrentSection);
updateCurrentSection();

// Content stays visible by default; entrances never gate reading or navigation.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window) ||
      typeof Element.prototype.animate !== 'function') return;

  // Keep sticky titles and certifications outside transformed ancestor groups.
  const targets = [...document.querySelectorAll(
    '.section-heading, .experience-feature, .project-image, .project-story, ' +
    '.skill-group, .about-layout, .contact-layout'
  )];
  const pending = new Set();
  const active = new Map();
  const tokens = getComputedStyle(document.documentElement);
  const duration = parseFloat(tokens.getPropertyValue('--motion-reveal')) || 400;
  const distance = tokens.getPropertyValue('--motion-distance').trim() || '12px';
  const easing = tokens.getPropertyValue('--motion-ease').trim() || 'ease-out';

  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting);
    entering.forEach((entry, index) => {
      const element = entry.target;
      observer.unobserve(element);
      if (!pending.delete(element) || reducedMotion.matches || document.hidden ||
          element.matches(':focus-within') || entry.boundingClientRect.bottom <= 0) return;

      const animation = element.animate([
        { opacity: 0, transform: `translateY(${distance})` },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration, easing, delay: Math.min(index * 45, 90), fill: 'backwards' });
      active.set(element, animation);
      const cleanup = () => active.delete(element);
      animation.finished.then(cleanup, cleanup);
    });
  }, { threshold: 0, rootMargin: '0px 0px 48px 0px' });

  const initialTarget = document.getElementById(location.hash.slice(1));
  targets.forEach(element => {
    // Leave the current viewport, previously read content and deep links alone.
    if (element.getBoundingClientRect().top <= window.innerHeight + 48 ||
        (initialTarget && (initialTarget.contains(element) || element.contains(initialTarget)))) return;
    pending.add(element);
    observer.observe(element);
  });

  function settleWithin(target) {
    if (!(target instanceof Element)) return;
    for (const element of new Set([...pending, ...active.keys()])) {
      if (element.contains(target) || target.contains(element)) {
        observer.unobserve(element);
        pending.delete(element);
        active.get(element)?.cancel();
      }
    }
  }

  document.addEventListener('focusin', event => settleWithin(event.target));
  window.addEventListener('hashchange', () => settleWithin(document.getElementById(location.hash.slice(1))));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) active.forEach(animation => animation.cancel());
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    pending.clear();
    active.forEach(animation => animation.cancel());
  });
})();

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
