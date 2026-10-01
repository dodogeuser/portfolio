export const projects = [
    {
        slug: 'shadowwatch', name: 'ShadowWatch', number: '01', category: 'Security operations', status: 'Operational training simulator',
        summary: 'An environment for practicing security operations, from the first alert to a structured incident response.',
        overview: 'ShadowWatch is a SOC training simulator bringing alert triage, incident management, IOC extraction, and threat intelligence into a learning workflow. Its focus is helping analysts practice investigation and response in a training setting.',
        scope: ['Alert triage and investigation workflows.', 'Incident management organized around PICERL: preparation, identification, containment, eradication, recovery, and lessons learned.', 'Indicators of compromise and threat intelligence context.', 'Gamification to support security training.'],
        flow: ['Training alerts', 'Triage & investigate', 'Incident response'],
        security: 'The supplied project description includes role-based access control, CSRF protection, bcrypt password hashing, and PDO database access. These are documented project features; a source-code review is still pending.',
        boundary: 'Presented as an operational training simulator, rather than a production SOC deployment. The diagram below is conceptual and does not assert a verified implementation architecture.',
    },
    {
        slug: 'tracezero', name: 'TRACEZERO', number: '02', category: 'Digital forensics', status: 'In development · Phase 06',
        summary: 'A digital forensics platform exploring how to preserve trust in evidence throughout an investigation.',
        overview: 'TRACEZERO centers on evidence integrity, scoped authorization, and chain of custody. Development is documented through Phase 06, before the unified timeline. The project is still in progress.',
        scope: ['SHA-256 verification for evidence integrity.', 'Scoped access to investigation resources.', 'Chain-of-custody records and evidence handling.', 'Concurrency and archive-safety considerations.'],
        flow: ['Evidence intake', 'Integrity & custody', 'Investigation'],
        security: 'The project’s security concerns include preserving evidence hashes, enforcing authorization boundaries, handling concurrent changes, and processing archives safely. Detailed implementation claims require source verification.',
        boundary: 'The unified timeline and later phases are outside the documented scope. This page does not imply a completed product; the workflow is a conceptual overview.',
    },
    {
        slug: 'crypto-scalping-bot', name: 'Crypto Scalping Bot', number: '03', category: 'Strategy research', status: 'Research · Simulation & backtesting',
        summary: 'Exploring market-strategy logic through controlled simulation and backtesting.',
        overview: 'This research project investigates EMA crossover strategies for BTC/USDT. Its focus is strategy logic and historical simulation. It is not presented as an AI system, a profitable strategy, or a live trading service.',
        scope: ['BTC/USDT as the research market.', 'EMA crossover strategy exploration.', 'Simulation and historical backtesting.', 'Review of strategy behavior before any deployment claims.'],
        flow: ['Historical data', 'EMA strategy', 'Backtest review'],
        security: 'No exchange credentials or trading actions are exposed by this portfolio. Exact EMA periods, entry and exit rules, and implementation details remain subject to source verification.',
        boundary: 'No performance metrics or profitability claims are published. The conceptual workflow describes a research direction, not verified trading results.',
    },
];
