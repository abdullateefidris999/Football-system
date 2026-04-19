# MIU Football Tournament System

## User Manual

**Version 1.0**  
**Mewar International University**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Team Manager Guide](#3-team-manager-guide)
   - 3.1 [Registration](#31-registration)
   - 3.2 [Team Dashboard](#32-team-dashboard)
   - 3.3 [Roster Management](#33-roster-management)
   - 3.4 [Match Schedule](#34-match-schedule)
   - 3.5 [Tournament Standings](#35-tournament-standings)
4. [Admin Guide](#4-admin-guide)
   - 4.1 [Admin Login](#41-admin-login)
   - 4.2 [Admin Dashboard](#42-admin-dashboard)
   - 4.3 [Tournament Management](#43-tournament-management)
   - 4.4 [Team Management](#44-team-management)
   - 4.5 [Match Scheduling](#45-match-scheduling)
   - 4.6 [Result Entry](#46-result-entry)
5. [Appendix](#5-appendix)

---

## 1. Introduction

### 1.1 System Overview

The MIU Football Tournament System is a comprehensive web-based platform designed for managing football tournaments at Mewar International University. The system streamlines the entire tournament lifecycle, from team registration to final standings calculation.

### 1.2 Key Features

- Online team registration for tournaments
- Roster management with player details
- Automated fixture generation
- Real-time match scheduling
- Score entry with automatic standings updates
- Live tournament standings

### 1.3 User Roles

The system supports two types of users:

| Role | Description | Access |
|------|-------------|--------|
| **Admin** | Tournament organizers and administrators | Full system access: create tournaments, manage teams, schedule matches, enter results |
| **Team Manager** | Team representatives | Team-specific access: manage roster, view matches and standings |

### 1.4 System Requirements

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection
- Valid email address for registration

---

## 2. Getting Started

### 2.1 Accessing the System

1. Open your web browser
2. Navigate to the MIU Football Tournament System URL
3. You will see the landing page with open tournaments

### 2.2 Home Page Layout

The landing page displays:

- **Navigation Bar**: Links to Home, Tournaments, Team Login, and Admin Login
- **Hero Section**: Welcome message and quick action buttons
- **Open Tournaments**: Cards showing tournaments accepting registrations
- **Features Section**: Overview of system capabilities
- **Footer**: Contact information and quick links

### 2.3 Navigation Overview

| Element | Action |
|---------|--------|
| MIU Logo | Returns to home page |
| View Tournaments | Scrolls to tournament listings |
| Team Portal | Opens team login page |
| Admin | Opens admin login page |

---

## 3. Team Manager Guide

This section covers all features available to team managers.

### 3.1 Registration

#### Finding Open Tournaments

1. Visit the system's home page
2. Scroll down to the "Open Tournaments" section
3. Browse available tournaments
4. Each tournament card shows:
   - Tournament name
   - Format (Round Robin, Knockout, or Group + Knockout)
   - Registration deadline
   - Maximum teams allowed
   - Current registration status

#### Registering Your Team

1. Click **"Register Your Team"** on your chosen tournament card
2. Fill in the registration form:

| Field | Description | Required |
|-------|-------------|----------|
| Team Name | Your team's official name | Yes |
| Email | Contact email (used for login) | Yes |
| Password | Minimum 8 characters | Yes |
| Confirm Password | Must match password | Yes |
| Phone Number | Contact phone | No |

3. Click **"Register Team"**
4. Check your email for a confirmation link
5. Click the confirmation link to verify your account

#### First Login

1. Navigate to **Team Portal** from the home page
2. Enter your registered email and password
3. Click **"Sign In"**
4. You will be redirected to your Team Dashboard

> **Note**: Your team will be in "Pending" status until an admin approves your registration.

---

### 3.2 Team Dashboard

The Team Dashboard is your central hub for managing your team.

#### Dashboard Sections

**Header Area**
- Your team name
- Current team status badge
- Tournament name
- "Manage Roster" button

**Status Cards**

| Card | Information Displayed |
|------|----------------------|
| Team Status | Registration approval status (Pending/Approved/Rejected) |
| Roster Status | Roster submission state (Draft/Submitted/Locked) |
| Players | Current player count vs. required minimum |

**Upcoming Matches**
- Shows your next 3 scheduled matches
- Displays opponent, date, time, and venue
- "View All" link to full schedule

**Quick Actions**
- Roster Management
- Match Schedule
- Tournament Standings

#### Understanding Team Status

| Status | Meaning |
|--------|---------|
| Pending | Awaiting admin approval |
| Approved | Registration accepted, team can participate |
| Rejected | Registration denied by admin |

---

### 3.3 Roster Management

The Roster Management page allows you to build and submit your team squad.

#### Accessing Roster Management

1. From the Dashboard, click **"Manage Roster"** or
2. Use the sidebar menu and select **"Roster"**

#### Adding Players

1. Click the **"Add Player"** button
2. Fill in the player form:

| Field | Description | Required |
|-------|-------------|----------|
| Name | Player's full name | Yes |
| Jersey Number | Number between 1-99 | No |
| Position | GK, DEF, MID, or FWD | No |
| Department | Academic department | No |
| Level | Academic level (e.g., 300 Level) | No |

3. Click **"Add"** to save the player

#### Editing Player Information

1. Find the player in the roster table
2. Click the **pencil icon** in the Actions column
3. Update the desired fields
4. Click **"Update"** to save changes

#### Deleting Players

1. Find the player in the roster table
2. Click the **trash icon** in the Actions column
3. Confirm the deletion when prompted

#### Setting Team Captain

Every team must designate one captain before submitting the roster.

1. Find the player you want to make captain
2. Click the **star icon** in the Captain column
3. The selected player will show a filled star icon

> **Note**: Only one player can be captain at a time. Setting a new captain automatically removes the previous one.

#### Roster Requirements

Before submitting your roster, ensure:

- [ ] Minimum number of players reached (shown in dashboard)
- [ ] Team captain designated

The system displays a checklist showing your progress toward these requirements.

#### Submitting Your Roster

1. Complete all roster requirements
2. Click the **"Submit Roster"** button
3. Confirm the submission

> **Important**: After submission, you cannot add, edit, or remove players. The roster is locked for admin review.

#### Roster Status Explained

| Status | What You Can Do |
|--------|-----------------|
| Draft | Add, edit, remove players; set captain |
| Submitted | View only; awaiting admin review |
| Locked | View only; roster finalized by admin |

---

### 3.4 Match Schedule

View all your team's matches and results on the Match Schedule page.

#### Accessing Match Schedule

1. From the Dashboard, click **"Match Schedule"** in Quick Actions, or
2. Use the sidebar menu and select **"Matches"**

#### Match Schedule Features

**Filter Options**
- **All**: View all matches
- **Upcoming**: Only scheduled matches
- **Completed**: Only finished matches

**Match Statistics**
- Total matches count
- Upcoming matches count
- Completed matches count

#### Understanding the Match Table

| Column | Description |
|--------|-------------|
| # | Match number |
| Opponent | The team you're playing against |
| Home/Away | Whether you're the home or away team |
| Date | Match date and time |
| Venue | Match location |
| Score | Final score (for completed matches) |
| Result | Win/Draw/Loss indicator |

#### Result Indicators

| Badge | Meaning |
|-------|---------|
| WIN (Green) | Your team won |
| DRAW (Blue) | Match ended in a tie |
| LOSS (Red) | Your team lost |
| Scheduled | Match not yet played |

---

### 3.5 Tournament Standings

View the complete tournament standings table.

#### Accessing Standings

1. From the Dashboard, click **"Standings"** in Quick Actions, or
2. Use the sidebar menu and select **"Standings"**

#### Standings Table Columns

| Column | Full Name | Description |
|--------|-----------|-------------|
| # | Rank | Team's position in the table |
| Team | Team Name | Name of the team |
| P | Played | Total matches played |
| W | Won | Matches won |
| D | Drawn | Matches drawn |
| L | Lost | Matches lost |
| GF | Goals For | Total goals scored |
| GA | Goals Against | Total goals conceded |
| GD | Goal Difference | GF minus GA |
| Pts | Points | Total points (3 for win, 1 for draw) |

#### Finding Your Team

- Your team's row is highlighted with a different background color
- A "You" badge appears next to your team name

#### Team Summary Card

At the top of the page, you'll see a summary of your team's position:
- Current rank
- Total points
- Win/Draw/Loss record
- Goal difference

#### Refreshing Standings

Click the **"Refresh"** button to load the latest standings data.

---

## 4. Admin Guide

This section covers all administrative features for tournament management.

### 4.1 Admin Login

#### Accessing Admin Login

1. From the home page, click **"Admin"** in the navigation bar
2. Or navigate directly to the admin login URL

#### Signing In

1. Enter your admin email address
2. Enter your password
3. Click **"Sign In as Admin"**

> **Note**: Only users with admin privileges can access the admin portal. If you don't have admin access, contact the system administrator.

---

### 4.2 Admin Dashboard

The Admin Dashboard provides an overview of the entire system.

#### Statistics Cards

| Stat | Description |
|------|-------------|
| Total Tournaments | Number of tournaments in the system |
| Total Teams | Number of registered teams |
| Pending Approvals | Teams awaiting approval |
| Upcoming Matches | Scheduled matches |

#### Quick Actions

| Button | Destination |
|--------|-------------|
| Create Tournament | New tournament form |
| Manage Teams | Team management page |
| Schedule Matches | Match scheduler |
| Enter Results | Result entry page |

#### Recent Registrations

A table showing the latest team registrations:
- Team name
- Tournament
- Registration status

#### Upcoming Matches

A preview of the next scheduled matches:
- Match fixture (Home vs Away)
- Date and time
- Venue

---

### 4.3 Tournament Management

#### Creating a Tournament

1. Navigate to **Tournaments** in the sidebar
2. Click **"New Tournament"**
3. Fill in the tournament form:

**Basic Information**

| Field | Description | Required |
|-------|-------------|----------|
| Name | Tournament name | Yes |
| Description | Tournament details | No |
| Format | Round Robin, Knockout, or Group + Knockout | Yes |
| Max Teams | Maximum number of teams | Yes |
| Players per Team | Required squad size | Yes |
| Registration Deadline | Last date for registration | Yes |
| Start Date | Tournament start date | Yes |
| End Date | Tournament end date | No |
| Status | Current tournament status | Yes |

**Group + Knockout Settings** (if applicable)

| Field | Description |
|-------|-------------|
| Number of Groups | How many groups to create |
| Qualifiers per Group | Teams advancing from each group |
| Seeding Strategy | How knockout bracket is seeded |

4. Optionally upload a banner image
5. Click **"Save Tournament"**

#### Tournament Formats Explained

**Round Robin**
- Every team plays against every other team
- Best for league-style competitions
- Provides maximum fairness

**Knockout**
- Single elimination bracket
- Losing team is eliminated
- Best for quick tournaments

**Group + Knockout**
- Teams divided into groups
- Round robin within groups
- Top teams advance to knockout stage
- Best for large tournaments

#### Tournament Status Workflow

| Status | Description |
|--------|-------------|
| Draft | Tournament being prepared, not visible to public |
| Registration Open | Teams can register |
| Upcoming | Registration closed, tournament starting soon |
| Ongoing | Tournament in progress |
| Completed | Tournament finished |

#### Managing Existing Tournaments

**Viewing Tournament List**
1. Navigate to **Tournaments** in the sidebar
2. Use filters to find specific tournaments:
   - Filter by status
   - Search by name

**Editing a Tournament**
1. Find the tournament in the list
2. Click the **pencil icon**
3. Update the desired fields
4. Click **"Save Tournament"**

**Viewing Tournament Details**
1. Click the **eye icon** on a tournament
2. View tabs:
   - **Teams**: Registered teams
   - **Matches**: Scheduled matches
   - **Standings**: Current standings
   - **Info**: Tournament details

**Deleting a Tournament**
1. Click the **trash icon**
2. Confirm the deletion

> **Warning**: Deleting a tournament removes all associated teams, matches, and results.

---

### 4.4 Team Management

#### Accessing Team Management

Navigate to **Teams** in the sidebar.

#### Filtering Teams

| Filter | Options |
|--------|---------|
| Tournament | Select specific tournament |
| Status | Pending, Approved, Rejected, Disqualified |

#### Team Actions

**Approving a Team**
1. Find a team with "Pending" status
2. Click **"Approve"**
3. The team status changes to "Approved"

**Rejecting a Team**
1. Find a team with "Pending" status
2. Click **"Reject"**
3. Confirm the rejection
4. The team status changes to "Rejected"

**Disqualifying a Team**
1. Find a team with "Approved" status
2. Click **"Disqualify"**
3. Confirm the disqualification
4. The team status changes to "Disqualified"

#### Viewing Team Rosters

1. Click **"View Roster"** for any team
2. A dialog opens showing:
   - Player list with details
   - Jersey number, name, position, department
   - Captain indicator
3. For submitted rosters, click **"Lock Roster"** to finalize

#### Locking Rosters

When a team submits their roster:
1. Review the player list
2. Click **"Lock Roster"** to approve
3. The roster becomes read-only for the team

---

### 4.5 Match Scheduling

#### Accessing Match Scheduler

Navigate to **Matches** in the sidebar.

#### Generating Fixtures

For round-robin tournaments:

1. Select a tournament from the dropdown
2. Review the approved teams count
3. Click **"Generate Fixtures"**
4. Confirm the generation
5. The system creates all match pairings automatically

> **Note**: Generated fixtures preserve any existing matches. They are not deleted.

#### Understanding Generated Fixtures

The system automatically:
- Creates all team pairings
- Assigns match numbers
- Labels rounds (Round 1, Round 2, etc.)
- Sets status to "Scheduled"

#### Adding a Manual Match

1. Click **"Add Match"**
2. Select the home team
3. Select the away team
4. Set the date and time
5. Enter the venue
6. Enter the round label
7. Click **"Add Match"**

> **Note**: Home and away teams must be different.

#### Editing Matches

All fields can be edited inline:

| Field | How to Edit |
|-------|-------------|
| Date & Time | Click the date picker, select new date/time |
| Venue | Click the text field, type new venue, click away to save |
| Round | Click the text field, type new round, click away to save |

#### Deleting Matches

1. Find the match in the table
2. Click the **trash icon**
3. Confirm the deletion

> **Note**: Completed matches cannot be deleted.

---

### 4.6 Result Entry

#### Accessing Result Entry

Navigate to **Results** in the sidebar.

#### Entering Match Results

1. Select a tournament from the dropdown
2. Optionally filter by status (Scheduled/Completed)
3. Find the match you want to update
4. Enter the home team score
5. Enter the away team score
6. Click **"Save"**

#### What Happens When You Save

1. The score is recorded in the database
2. The match status changes to "Completed"
3. Tournament standings are automatically updated
4. The score fields become read-only
5. A "Saved" badge appears in the Action column

#### Viewing Saved Results

Completed matches display:
- Score in bold (e.g., "2 - 1")
- "Completed" status badge
- "Saved" indicator in Action column

> **Note**: Once a result is saved, it cannot be modified through the standard interface.

#### Automatic Standings Update

When you save a result, the system automatically:
- Updates both teams' played count
- Adds appropriate points (3 for win, 1 for draw, 0 for loss)
- Updates goals for and against
- Recalculates goal difference
- Re-sorts the standings table

---

## 5. Appendix

### A. Tournament Formats Reference

| Format | Description | Matches for N Teams | Best For |
|--------|-------------|---------------------|----------|
| Round Robin | Every team plays every other team once | N × (N-1) / 2 | League competitions, maximum fairness |
| Knockout | Single elimination bracket | N - 1 | Quick tournaments, cup competitions |
| Group + Knockout | Group stage followed by elimination | Groups + bracket | Large tournaments, world cup style |

### B. Seeding Strategies

**Random Draw**
- Teams are randomly placed in the bracket
- No consideration of rankings
- Used for pure knockout tournaments

**Ranked 1 vs N**
- Top seed plays lowest seed
- Second seed plays second-lowest
- Protects higher-ranked teams

**Group Cross Seed**
- Group winners face runners-up from other groups
- Ensures teams from same group don't meet immediately
- Used for Group + Knockout tournaments

### C. Roster Lifecycle

| Stage | Status | Team Can | Admin Can |
|-------|--------|----------|-----------|
| 1 | Draft | Add, edit, delete players; set captain | View roster |
| 2 | Submitted | View only | Review and lock |
| 3 | Locked | View only | View only |

### D. Team Status Flow

```
Registration → Pending → Approved → (Disqualified)
                      ↘ Rejected
```

| Status | Description | Team Access |
|--------|-------------|-------------|
| Pending | Awaiting admin review | Limited (roster only) |
| Approved | Can participate in tournament | Full access |
| Rejected | Registration denied | No access |
| Disqualified | Removed from tournament | No access |

### E. Points System

| Result | Points |
|--------|--------|
| Win | 3 points |
| Draw | 1 point |
| Loss | 0 points |

### F. Standings Tiebreakers

Teams are ranked by:
1. Total points (highest first)
2. Goal difference (highest first)
3. Goals scored (highest first)

### G. Keyboard Shortcuts

| Action | Where | How |
|--------|-------|-----|
| Submit form | Any form | Press Enter |
| Close dialog | Any dialog | Press Escape |

---

## Support

For technical support or questions about the MIU Football Tournament System, please contact:

**MIU Sports Department**  
Email: sports@miu.edu  
Mewar International University

---

*Document Version: 1.0*  
*Last Updated: April 2026*
