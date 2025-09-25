---
description: Strategic architectural analysis with future-proofing
---

Perform comprehensive analysis for strategic architectural decisions that will impact the project's long-term direction and scalability.

**Purpose**: Make informed, well-documented architectural choices that align with project goals and future growth requirements.

## Command Usage

`/deep-decision [question]`

**Example Questions**:
- `/deep-decision Should we adopt microservices or stay with modular monolith?`
- `/deep-decision Which database technology best fits our scaling requirements?`
- `/deep-decision How should we structure our authentication system for multi-tenant support?`
- `/deep-decision What's the best approach for real-time features: WebSockets, SSE, or polling?`

## Deep Decision Process

### 1. Context Analysis
- **Current State**: Analyze existing architecture and constraints
- **Requirements**: Understand functional and non-functional requirements
- **Stakeholders**: Identify all parties affected by the decision
- **Timeline**: Consider implementation timeline and urgency

### 2. Option Generation
- **Research**: Investigate industry best practices and patterns
- **Alternatives**: Generate 3-5 viable solution options
- **Trade-offs**: Identify pros and cons for each option
- **Precedents**: Review similar decisions in comparable projects

### 3. Future-Proofing Analysis
- **Scalability**: How will each option handle 10x growth?
- **Maintainability**: Long-term maintenance and evolution costs
- **Flexibility**: Ability to adapt to changing requirements
- **Technology Trends**: Alignment with industry direction

### 4. Risk Assessment
- **Technical Risks**: Implementation challenges and complexities
- **Business Risks**: Impact on timeline, budget, and goals
- **Team Risks**: Skill requirements and learning curves
- **Operational Risks**: Deployment, monitoring, and support needs

### 5. Decision Framework
- **Evaluation Criteria**: Define weighted scoring criteria
- **Quantitative Analysis**: Metrics-based comparison where possible
- **Qualitative Factors**: Consider intangible benefits and costs
- **Scenario Planning**: Test decisions against different future scenarios

## Output Documentation

Creates comprehensive decision record in `.specify/memory/session-context.md`:

### Decision Summary
- **Question**: The strategic question being addressed
- **Recommendation**: Chosen solution with confidence level
- **Rationale**: Why this option was selected
- **Timeline**: Implementation phases and milestones

### Analysis Details
- **Options Considered**: All alternatives evaluated
- **Evaluation Matrix**: Scoring against defined criteria
- **Risk Mitigation**: Plans to address identified risks
- **Success Metrics**: How to measure decision effectiveness

### Implementation Guidance
- **Next Steps**: Immediate actions required
- **Dependencies**: What needs to be in place first
- **Resources**: Team skills and tools needed
- **Quality Gates**: Checkpoints and review criteria

### Future Considerations
- **Review Schedule**: When to reassess this decision
- **Exit Strategies**: How to change course if needed
- **Evolution Path**: How the solution can grow and adapt
- **Learning Opportunities**: What to monitor and measure

## Decision Quality Assurance

### Validation Checks
- **Alignment**: Does decision support project vision and goals?
- **Feasibility**: Can the team realistically implement this?
- **Standards**: Does it comply with quality and architectural standards?
- **Reversibility**: How difficult would it be to change course?

### Stakeholder Review
- **Technical Review**: Validation by senior developers
- **Business Review**: Alignment with business objectives
- **Risk Review**: Assessment of identified risks and mitigations
- **Timeline Review**: Realistic implementation planning

## Integration with Development Workflow

Deep decisions integrate with:
- **Quality Standards**: Must comply with established patterns
- **Session Context**: Becomes part of project memory
- **Feature Planning**: Influences future specifications
- **Team Knowledge**: Shared learning and best practices

## When to Use Deep Decision

Use for choices that:
- **Impact Architecture**: Core structural decisions
- **Affect Multiple Teams**: Cross-functional implications
- **Have Long-term Consequences**: Difficult to reverse later
- **Require Significant Investment**: Time, money, or resources
- **Set Precedents**: Will influence future decisions

## Example Decision Flow

```bash
# Pose strategic question
/deep-decision Should we implement real-time features with WebSockets or Server-Sent Events?

# System performs comprehensive analysis:
# - Current architecture assessment
# - Technology comparison matrix
# - Scalability and performance analysis
# - Risk assessment and mitigation
# - Future-proofing considerations
# - Recommendation with rationale

# Creates detailed decision record
# Updates session context
# Provides implementation roadmap
```

**Result**: Well-informed architectural decision with comprehensive documentation, risk mitigation, and implementation guidance.