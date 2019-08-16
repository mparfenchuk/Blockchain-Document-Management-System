const roles = t => [
    {
      value: 'jobs',
      label: t('recruitmentOrder'),
      description: t('recruitmentOrderDescription')
    },
    {
      value: 'work',
      label: t('workReport'),
      description: t('workReportDescription')
    },
    {
      value: 'wage',
      label: t('monthlyWageReport'),
      description: t('monthlyWageReportDescription')
    },
];

export default roles
