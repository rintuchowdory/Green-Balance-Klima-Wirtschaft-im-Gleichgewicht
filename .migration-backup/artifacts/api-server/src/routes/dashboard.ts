import { Router } from "express";

const router = Router();

router.get("/summary", (_req, res) => {
  res.json({
    co2TotalMt: 673,
    renewablePercent: 59.0,
    greenJobs: 342,
    traditionalJobs: 118,
    electricityPriceCents: 31.2,
    co2Change: -4.8,
    renewableChange: 6.1,
    greenJobsChange: 8.3,
  });
});

router.get("/co2", (_req, res) => {
  const data = [
    { year: 2000, value: 1017 },
    { year: 2002, value: 991 },
    { year: 2004, value: 989 },
    { year: 2006, value: 1001 },
    { year: 2008, value: 974 },
    { year: 2010, value: 960 },
    { year: 2012, value: 940 },
    { year: 2014, value: 912 },
    { year: 2016, value: 906 },
    { year: 2018, value: 866 },
    { year: 2019, value: 811 },
    { year: 2020, value: 739 },
    { year: 2021, value: 762 },
    { year: 2022, value: 746 },
    { year: 2023, value: 673 },
  ];
  res.json(data);
});

router.get("/energy", (_req, res) => {
  const data = [
    { year: 2010, electricityPrice: 23.7, renewableShare: 17.0, coalShare: 41.5, gasShare: 14.0 },
    { year: 2012, electricityPrice: 25.9, renewableShare: 22.1, coalShare: 44.2, gasShare: 12.1 },
    { year: 2014, electricityPrice: 29.1, renewableShare: 27.3, coalShare: 43.1, gasShare: 9.9 },
    { year: 2016, electricityPrice: 28.7, renewableShare: 32.3, coalShare: 40.3, gasShare: 12.6 },
    { year: 2018, electricityPrice: 29.4, renewableShare: 37.8, coalShare: 37.1, gasShare: 12.9 },
    { year: 2020, electricityPrice: 30.4, renewableShare: 45.4, coalShare: 24.1, gasShare: 16.3 },
    { year: 2021, electricityPrice: 32.2, renewableShare: 41.1, coalShare: 27.9, gasShare: 15.4 },
    { year: 2022, electricityPrice: 40.8, renewableShare: 47.0, coalShare: 31.4, gasShare: 11.0 },
    { year: 2023, electricityPrice: 31.2, renewableShare: 59.0, coalShare: 25.3, gasShare: 13.1 },
  ];
  res.json(data);
});

router.get("/jobs", (_req, res) => {
  const data = [
    { year: 2010, greenJobs: 160, coalJobs: 92, oilGasJobs: 48 },
    { year: 2012, greenJobs: 191, coalJobs: 88, oilGasJobs: 45 },
    { year: 2014, greenJobs: 214, coalJobs: 82, oilGasJobs: 42 },
    { year: 2016, greenJobs: 238, coalJobs: 74, oilGasJobs: 40 },
    { year: 2018, greenJobs: 264, coalJobs: 68, oilGasJobs: 38 },
    { year: 2020, greenJobs: 295, coalJobs: 52, oilGasJobs: 33 },
    { year: 2021, greenJobs: 311, coalJobs: 47, oilGasJobs: 31 },
    { year: 2022, greenJobs: 327, coalJobs: 43, oilGasJobs: 29 },
    { year: 2023, greenJobs: 342, coalJobs: 38, oilGasJobs: 28 },
  ];
  res.json(data);
});

export default router;
