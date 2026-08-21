/* =========================================================
   DEFAULT EDUCATION & CERTIFICATE DATA
   Loaded once into localStorage ("gt_custom_education" and
   "gt_custom_certs") the first time any page runs, after which
   everything (including these originals) is fully editable/
   deletable from the Admin Panel — nothing here is hardcoded
   into the page HTML anymore.
========================================================= */
window.GT_DEFAULT_EDUCATION = [
    { id: 'edu1', date: '2024 – 2028 (Expected)', title: 'BS Computer Science', institution: 'The Islamia University of Bahawalpur' },
    { id: 'edu2', date: '2021 – 2023', title: 'F.Sc. Pre-Medical', institution: 'Moon System of Education' },
    { id: 'edu3', date: '2019 – 2021', title: 'Matriculation (Science)', institution: 'Rehman Public High School' }
];

window.GT_DEFAULT_CERTS = [
    { id: 'cert2', icon: 'fa-chart-line', title: 'Lead Generation Course', subtitle: 'Completed certification in lead generation fundamentals', image: '' },
    { id: 'cert3', icon: 'fa-medal', title: 'Topper Student', subtitle: 'Rehman Public School — 2020', image: '' },
    { id: 'cert4', icon: 'fa-microphone', title: 'Outstanding Performance, Speech Competition', subtitle: 'Moon System of Education — 2022', image: '' },
    { id: 'cert1', icon: 'fa-trophy', title: 'WordPress Development', subtitle: 'Microtech IT Solutions — Nov 2023 to Feb 2024 · Grade A+', image: 'assets/certificate-wordpress.png' },
    { id: 'cert5', icon: 'fa-award', title: 'Introduction to ChatGPT', subtitle: 'DataCamp — completed Jun 4, 2024 · 1 hour', image: 'assets/DataCamp-chatgpt.png' },
    { id: 'cert6', icon: 'fa-award', title: 'Data Preparation in Excel', subtitle: 'DataCamp — completed Jun 4, 2024 · 3 hours', image: 'assets/DataCamp-excel.png' }
];
