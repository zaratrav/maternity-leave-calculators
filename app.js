// ===== MATERNITY/PATERNITY LEAVE CALCULATOR =====

function calculateLeave() {
const leaveType = document.getElementById(‘leaveType’).value;
const state = document.getElementById(‘workState’).value;
const dueDate = document.getElementById(‘dueDate’).value;
const salary = parseFloat(document.getElementById(‘employeeAnnualSalary’).value) || 0;
const companySize = document.getElementById(‘employeeCompanySize’).value;
const employmentMonths = parseInt(document.getElementById(‘employmentMonths’).value) || 0;


if (!dueDate || salary <= 0) {
    return;
}

// Calculate leave benefits by state
let totalWeeks = 0;
let paidWeeks = 0;
let weeklyBenefit = 0;
let notes = [];

const weeklySalary = salary / 52;

// State-specific calculations
if (state === 'nj') {
    // TDI: 6 weeks @ 2/3 salary (capped $752/week)
    const tdiRate = Math.min((weeklySalary * 2) / 3, 752);
    const tdiWeeks = 6;

    // FLI: 12 weeks @ 2/3 salary (capped $752/week)
    const fliRate = Math.min((weeklySalary * 2) / 3, 752);
    const fliWeeks = 12;

    totalWeeks = tdiWeeks + fliWeeks + 12; // +12 FMLA unpaid
    paidWeeks = tdiWeeks + fliWeeks;
    weeklyBenefit = tdiRate; // Simplified: same rate for both

    notes = [
        '✓ TDI (6 weeks): Temporary Disability Insurance',
        '✓ FLI (12 weeks): Family Leave Insurance',
        '✓ FMLA (12 weeks unpaid): Job protection only',
        '⚠️ Must apply 4-6 weeks before due date',
        '⚠️ Benefits are taxable income'
    ];
} else if (state === 'ca') {
    // SDI: 4 weeks @ 55-60% salary
    // PFL: 8 weeks @ 55% salary
    const replacementRate = 0.55;
    const sdiWeeks = 4;
    const pflWeeks = 8;

    totalWeeks = sdiWeeks + pflWeeks + 12;
    paidWeeks = sdiWeeks + pflWeeks;
    weeklyBenefit = Math.min(weeklySalary * replacementRate, 1615); // CA cap

    notes = [
        '✓ SDI (4 weeks): State Disability Insurance',
        '✓ PFL (8 weeks): Paid Family Leave',
        '✓ FMLA (12 weeks unpaid): Job protection only',
        '⚠️ 55% salary replacement (capped at $1,615/week)',
        '⚠️ Apply through EDD website'
    ];
} else if (state === 'ny') {
    // DBL: 6 weeks @ 50% salary
    // PFL: 10 weeks @ 50% salary
    const replacementRate = 0.50;
    const dblWeeks = 6;
    const pflWeeks = 10;

    totalWeeks = dblWeeks + pflWeeks + 12;
    paidWeeks = dblWeeks + pflWeeks;
    weeklyBenefit = Math.min(weeklySalary * replacementRate, 1417); // NY cap

    notes = [
        '✓ DBL (6 weeks): Disability Benefit Law',
        '✓ PFL (10 weeks): Paid Family Leave',
        '✓ FMLA (12 weeks unpaid): Job protection only',
        '⚠️ 50% salary replacement (capped at $1,417/week)',
        '⚠️ Apply through NY Paid Leave website'
    ];
} else if (state === 'federal') {
    // FMLA only: 12 weeks unpaid
    totalWeeks = 12;
    paidWeeks = 0;
    weeklyBenefit = 0;

    // Check FMLA eligibility
    const fmlaEligible = companySize === 'medium' && employmentMonths >= 12;

    if (!fmlaEligible) {
        notes = [
            '⚠️ You may NOT be FMLA eligible',
            '✗ Company must have 50+ employees',
            '✗ You must have worked 12+ months',
            '✗ You must have worked 1,250+ hours',
            '→ Contact your HR about company policy'
        ];
    } else {
        notes = [
            '✓ FMLA (12 weeks): Unpaid but job-protected',
            '⚠️ No paid leave from federal program',
            '→ Check employer policy for additional benefits',
            '→ You can use PTO/sick leave if available',
            '⚠️ You pay health insurance during leave'
        ];
    }
} else {
    // Other states: FMLA only
    totalWeeks = 12;
    paidWeeks = 0;
    weeklyBenefit = 0;

    notes = [
        '✓ FMLA (12 weeks): Federal protection',
        '⚠️ No mandatory state-paid leave',
        '→ Depends entirely on employer policy',
        '→ Check with HR about maternity benefits',
        '→ Negotiate if possible'
    ];
}

// Display results
document.getElementById('leaveDuration').textContent = totalWeeks + ' weeks';
document.getElementById('paidWeeks').textContent = paidWeeks;
document.getElementById('weeklyBenefit').textContent = '$' + Math.round(weeklyBenefit);
document.getElementById('totalBenefit').textContent = '$' + Math.round(weeklyBenefit * paidWeeks);

// Timeline
const timelineDiv = document.getElementById('timelineDetails');
timelineDiv.innerHTML = `
    <div class="timeline-row">
        <span class="timeline-label">Leave Start:</span>
        <span class="timeline-value">${formatDate(dueDate)}</span>
    </div>
    <div class="timeline-row">
        <span class="timeline-label">Paid Leave Duration:</span>
        <span class="timeline-value">${paidWeeks} weeks</span>
    </div>
    <div class="timeline-row">
        <span class="timeline-label">Unpaid Extension:</span>
        <span class="timeline-value">${totalWeeks - paidWeeks} weeks (if applicable)</span>
    </div>
    <div class="timeline-row">
        <span class="timeline-label">Expected Return:</span>
        <span class="timeline-value">${formatDate(addWeeks(dueDate, totalWeeks))}</span>
    </div>
`;

// Notes
const notesList = document.getElementById('leaveNotesList');
notesList.innerHTML = '';
notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note;
    notesList.appendChild(li);
});

document.getElementById('leaveResults').style.display = 'block';


}

function setLeaveScenario(type, state, salary) {
document.getElementById(‘leaveType’).value = type;
document.getElementById(‘workState’).value = state;
document.getElementById(‘employeeAnnualSalary’).value = salary;
document.getElementById(‘employeeCompanySize’).value = ‘medium’;
document.getElementById(‘employmentMonths’).value = 24;


// Set due date to 2 months from now
const dueDate = new Date();
dueDate.setMonth(dueDate.getMonth() + 2);
document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

calculateLeave();
document.getElementById('leaveResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });


}

// ===== FMLA PAY CALCULATOR =====

function calculateFMLA() {
const weeks = parseInt(document.getElementById(‘fmlaWeeks’).value) || 0;
const weeklySalary = parseFloat(document.getElementById(‘fmlaWeeklySalary’).value) || 0;
const employerHealth = document.getElementById(‘fmlaEmployerContinuesHealth’).value === ‘yes’;
const paidDays = parseInt(document.getElementById(‘fmlaPaidDaysAvailable’).value) || 0;
const dailyRate = parseFloat(document.getElementById(‘fmlaPaidDayValue’).value) || 0;


if (weeks <= 0 || weeklySalary <= 0) {
    return;
}

// Calculate unpaid weeks
const paidWeeksFromPTO = Math.min(paidDays / 5, weeks); // Convert days to weeks
const unpaidWeeks = Math.max(0, weeks - paidWeeksFromPTO);
const incomeLoss = unpaidWeeks * weeklySalary;
const paidPTOAmount = paidWeeksFromPTO * weeklySalary;

// Health insurance
let healthCostNote = 'Covered by employer';
if (!employerHealth) {
    healthCostNote = 'You pay (estimate $300-800/month)';
}

// Display results
document.getElementById('fmlaUnpaidWeeks').textContent = Math.round(unpaidWeeks);
document.getElementById('fmlaIncomeLoss').textContent = '$' + Math.round(incomeLoss).toLocaleString();
document.getElementById('fmlaPaidPTO').textContent = '$' + Math.round(paidPTOAmount).toLocaleString();
document.getElementById('fmlaHealthCost').textContent = healthCostNote;

document.getElementById('fmlaResults').style.display = 'block';
```

}

function setFMLAScenario(weeks, weeklySalary, health, paidDays) {
document.getElementById(‘fmlaWeeks’).value = weeks;
document.getElementById(‘fmlaWeeklySalary’).value = weeklySalary;
document.getElementById(‘fmlaEmployerContinuesHealth’).value = health;
document.getElementById(‘fmlaPaidDaysAvailable’).value = paidDays;
calculateFMLA();
document.getElementById(‘fmlaResults’).scrollIntoView({ behavior: ‘smooth’, block: ‘nearest’ });
}

// ===== HELPERS =====

function addWeeks(dateStr, weeks) {
const date = new Date(dateStr);
date.setDate(date.getDate() + weeks * 7);
return date.toISOString().split(‘T’)[0];
}

function formatDate(dateStr) {
const options = { year: ‘numeric’, month: ‘long’, day: ‘numeric’ };
return new Date(dateStr + ‘T00:00:00’).toLocaleDateString(‘en-US’, options);
}

// Initialize
document.addEventListener(‘DOMContentLoaded’, function() {
// Set default due date to 3 months from now
const dueDate = new Date();
dueDate.setMonth(dueDate.getMonth() + 3);
document.getElementById(‘dueDate’).value = dueDate.toISOString().split(‘T’)[0];


calculateLeave();
calculateFMLA();


});