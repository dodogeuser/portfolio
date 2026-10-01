<?php
require __DIR__ . '/includes/contact-state.php';
require __DIR__ . '/includes/header.php';
?>
<main id="main-content" class="container">
    <section id="home" class="foundation-intro" aria-labelledby="page-heading">
        <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span> &gt; INITIALIZING PROFILE...</div>
        <div class="hero-terminal" data-hero-terminal>
            <p class="sr-only">George Youkhanna / Cybersecurity | Security Development.</p>
            <div aria-hidden="true">
                <p class="terminal-label">george@portfolio:~$ <span data-type-command>whoami</span><span class="terminal-cursor">_</span></p>
                <p class="terminal-result" data-type-result>George Youkhanna / Cybersecurity | Security Development</p>
            </div>
        </div>
        <h1 id="page-heading">GEORGE<br><span>YOUKHANNA</span><span class="heading-period">.</span></h1>
        <ul class="hero-roles" aria-label="Professional focus"><li>CYBERSECURITY</li><li>SECURITY DEVELOPMENT</li><li>BACKEND DEVELOPMENT</li></ul>
        <p class="intro-copy">Building security-focused systems, investigation platforms and cybersecurity tools.</p>
        <div class="intro-actions"><a class="button" href="#projects">View Projects <span aria-hidden="true">↗</span></a><a class="button button-secondary" href="https://github.com/dodogeuser" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
        <dl class="hero-meta"><div><dt>Status</dt><dd><span class="status-dot" aria-hidden="true"></span>Available</dd></div><div><dt>Location</dt><dd>Lebanon</dd></div></dl>
    </section>
    <section id="about" class="foundation-section operator-profile" aria-labelledby="about-heading">
        <p class="eyebrow">01 // OPERATOR PROFILE</p>
        <div class="profile-layout">
            <div class="profile-copy">
                <h2 id="about-heading">Security, with purpose.</h2>
                <p>I'm George Youkhanna, an IT and cybersecurity-focused developer based in Lebanon.</p>
                <p>My work focuses on building security-oriented applications, SOC training environments, digital forensics tools and backend systems.</p>
            </div>
            <dl class="profile-facts">
                <div class="profile-fact"><dt>Location</dt><dd>Lebanon</dd></div>
                <div class="profile-fact"><dt>Focus</dt><dd>Cybersecurity</dd></div>
                <div class="profile-fact"><dt>Development</dt><dd>Backend / Full Stack</dd></div>
                <div class="profile-fact"><dt>Specialization</dt><dd>Security Tools</dd></div>
            </dl>
        </div>
    </section>
    <section id="projects" class="foundation-section" aria-labelledby="projects-heading">
        <div class="section-heading"><div><p class="eyebrow">02 // FEATURED OPERATIONS</p><h2 id="projects-heading">Inside the work.</h2></div><p>SOC training, digital forensics and backend research.</p></div>
        <?php require __DIR__ . '/includes/project-cards.php'; ?>
    </section>
    <section id="skills" class="foundation-section" aria-labelledby="skills-heading">
        <div class="section-heading"><div><p class="eyebrow">03 // TECHNICAL ARSENAL</p><h2 id="skills-heading">Tools of the trade.</h2></div><p>Development, security and the systems behind them.</p></div>
        <?php require __DIR__ . '/includes/skills.php'; ?>
    </section>
    <section id="certifications" class="foundation-section" aria-labelledby="certifications-heading">
        <div class="section-heading"><div><p class="eyebrow">04 // CERTIFICATIONS &amp; TRAINING</p><h2 id="certifications-heading">Continuous learning.</h2></div><p>Cybersecurity foundations, investigation and security training.</p></div>
        <?php require __DIR__ . '/includes/certification-cards.php'; ?>
    </section>
    <section id="languages" class="foundation-section languages-section" aria-labelledby="languages-heading">
        <div class="section-heading"><div><p class="eyebrow">COMMUNICATION</p><h2 id="languages-heading">Language matrix.</h2></div></div>
        <ul class="language-grid">
            <li><span class="language-code" aria-hidden="true">EN</span><span class="language-name">English</span></li>
            <li><span class="language-code" aria-hidden="true">AR</span><span class="language-name">Arabic</span></li>
            <li><span class="language-code" aria-hidden="true">FR</span><span class="language-name">French</span></li>
        </ul>
    </section>
    <?php require __DIR__ . '/includes/terminal.php'; ?>
    <?php require __DIR__ . '/includes/contact-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
