I want to redesign the '/Users/jinsoon/Desktop/GCAA/透明足跡/company_detail_page_imagined/企業 Dashboard - UI.png' page which is provided as a png file. Relevant area to be dealt with is highlighted with a red square.

Focus on the part where we list a company's climate related data.

You could refer to 排碳大戶觀測站_raw_data - 範例數值.csv to see what sort of data (columns) we currently have for a company.

Refer to 排碳大戶觀測站_raw_data - 範例說明.csv to see the description of corresponding columns.

I'd like you to use chrome devtools mcp tool to inspect website structure, to mock the design of Netzerotracker (https://zerotracker.net/companies/formosa-petrochemical-com-0857).

(I mean the way they categorize and visualize company's data to rate their performance. Not copying the indicators / data they focus on, but rather ours.)

The Zerotracker's layout and focuses are:

Overall Layout
The dashboard uses a vertical, modular layout. The entire page is divided into four main thematic sections, each containing a set of related metrics. This design allows a user to scroll down and logically assess a company's complete climate commitments.

At the very top, a main navigation bar highlights these four core themes:

TARGETS

COVERAGE

GOVERNANCE

OFFSETS & SINKS

Core Visualization Method
The primary visualization method used throughout this dashboard is a "status category tracker." Instead of using traditional bar or pie charts, it provides a set of predefined "options" for each metric being evaluated.

Nodes: Each possible status (e.g., "Yes," "No," "Incomplete," "Not Specified") is represented by a circle (a node).

Status Highlighting: The company's actual status for that metric is marked with a solid magenta-colored circle.

Contrast Options: All other unselected possible options are shown as light gray, empty circles.

The advantage of this design is that it is immediately clear. A user can instantly "see" where the company stands on a specific metric without reading extensive text.

Breakdown of Sections
Here are the details of the four main sections shown on the dashboard:

1. TARGETS
This section focuses on the company's emission reduction commitments.

Target Status: Shows if the company has a net-zero target and what stage it is in (e.g., No Target, Pledged, In Corporate Strategy).

First interim target: Displays the year set for its first medium-term goal (in this case, 2025).

Type of interim target: Clarifies the nature of the target (e.g., Emissions Reduction, Absolute Reduction, Intensity Reduction).

2. COVERAGE
This section examines which emission sources are included in the climate targets.

Greenhouse gases: Which gases are covered (e.g., CO2 only, or CO2 + Others).

Historical emissions: Whether the company reports its historical emissions (Yes/No).

Full coverage of Scopes 1 and 2: If Scopes 1 and 2 are fully covered (Yes/No/Partial).

Scope 3 coverage: Whether Scope 3 is covered (Yes/No/Partial/Not Specified).

3. GOVERNANCE
This section assesses the robustness and transparency of the company's climate plan.

Detailed plan: The completeness of the plan (Complete/Incomplete/No Plan).

Annual reporting mechanism: Whether there is annual reporting (Yes/Less than annual/No mechanism).

Refers to equity: If the plan considers equity issues, such as a just transition (Yes/No).

Formal accountability: Whether formal oversight or accountability mechanisms exist (Yes/No/Not Specified).

4. OFFSETS & SINKS
This section reviews the company's strategy for carbon offsets and carbon dioxide removal (CDR).

Planning to use external offset credits: Whether the company plans to use them (Yes/No/Not Specified).

Separate targets for emission reductions and removals: Whether targets for reductions and removals are set separately (Yes/No).

Conditions on use of offset credits: If the company places conditions on its offset use (e.g., No Conditions, High Environmental Integrity, Excludes certain types).

Plans for carbon removals (CDR): Whether the company has a plan for CDR (Not Specified/No Plans/Unclear/Nature-based only/Tech-based only, etc.).


------------

We need to categorize our own data and present them in a clear way, using differentiated colors or other ways imaginable to make the information clearer and categorize them.

First develop a plan.md file. Then I will edit that file, so we can start our development of a prototype website focusing on displaying those information.

No need for any charts, just a way to organize and display the data.