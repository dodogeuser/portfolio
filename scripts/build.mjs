import { mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/projects.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
// Only replace the generated directory within this repository.
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'dist') throw new Error('Unsafe output directory');
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets/css'), { recursive: true });
await mkdir(path.join(output, 'projects'), { recursive: true });
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
await cp(path.join(root, 'index.html'), path.join(output, 'index.html'));
await writeFile(path.join(output, '.nojekyll'), '');

const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length];
    const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#080d13"><meta name="description" content="${escape(project.summary)}"><title>${escape(project.name)} | Georges Youkhanna</title><link rel="icon" href="../assets/icons/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/css/style.css"></head>
<body><a href="#main-content" class="sr-only focus:not-sr-only focus:bg-accent focus:p-4 focus:text-ink">Skip to content</a>
<header class="border-b border-line"><div class="shell flex min-h-20 items-center justify-between gap-4"><a class="font-mono text-2xl font-bold" href="../index.html" aria-label="Georges Youkhanna home">GY<span class="text-accent">.</span></a><a class="nav-link" href="../index.html#projects">← All projects</a></div></header>
<main id="main-content"><section class="hero-grid"><div class="shell py-20 md:py-28"><p class="eyebrow">Project ${project.number} / ${escape(project.category)}</p><h1 class="mt-6 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">${escape(project.name)}</h1><p class="mt-7 max-w-2xl text-xl leading-9 text-muted">${escape(project.summary)}</p><p class="mt-8 inline-block border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-xs text-accent">${escape(project.status)}</p></div></section>
<div class="shell grid gap-12 border-t border-line py-16 md:grid-cols-[.5fr_1.5fr] md:gap-20"><aside><p class="eyebrow">Inside the project</p><nav class="mt-6 flex flex-col gap-4 text-sm text-muted" aria-label="Project sections"><a class="hover:text-accent" href="#overview">01 / Overview</a><a class="hover:text-accent" href="#scope">02 / Scope</a><a class="hover:text-accent" href="#architecture">03 / Conceptual workflow</a><a class="hover:text-accent" href="#security">04 / Security considerations</a></nav></aside>
<div class="detail-copy min-w-0 space-y-14"><section id="overview"><h2>Overview</h2><p>${escape(project.overview)}</p></section><section id="scope"><h2>Project scope</h2><ul>${project.scope.map((item) => `<li>${escape(item)}</li>`).join('')}</ul></section><section id="architecture"><h2>Conceptual workflow</h2><p>${escape(project.boundary)}</p><ol class="mt-7 grid gap-3 sm:grid-cols-3">${project.flow.map((step, i) => `<li class="!list-none border border-line bg-panel p-5"><span class="block font-mono text-xs text-accent">0${i + 1}</span><span class="mt-3 block text-sm text-paper">${escape(step)}</span></li>`).join('')}</ol></section><section id="security"><h2>Security considerations</h2><p>${escape(project.security)}</p></section><a class="button button-outline" href="../index.html#contact">Talk about this project ↗</a></div></div>
<section class="section bg-panel"><div class="shell flex flex-wrap items-center justify-between gap-6"><div><p class="eyebrow">Continue exploring</p><h2 class="mt-4 text-3xl font-semibold">${escape(next.name)}</h2></div><a href="${next.slug}.html" class="button">Next project <span aria-hidden="true">↗</span></a></div></section></main><footer class="shell flex flex-wrap justify-between gap-4 py-7 text-xs text-muted"><span>Georges Youkhanna · Cybersecurity &amp; development</span><a href="../index.html">Back to portfolio ↑</a></footer></body></html>`;
    await writeFile(path.join(output, 'projects', `${project.slug}.html`), html);
}

// Static aliases for section URLs; GitHub Pages does not execute PHP redirects.
for (const section of ['about', 'projects', 'certifications', 'contact']) {
    await writeFile(path.join(output, `${section}.html`), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=./index.html#${section}"><title>Georges Youkhanna</title></head><body><a href="./index.html#${section}">Continue to ${section}</a></body></html>`);
}
const home = await readFile(path.join(output, 'index.html'), 'utf8');
if (home.includes('<?php') || /["'](?:[^"']*)\.php/.test(home)) throw new Error('PHP reference in static output');
console.log('Static HTML and assets built in dist/.');
