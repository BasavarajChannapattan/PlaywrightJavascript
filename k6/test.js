import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    sustainable_scenario: {
      executor: "ramping-arrival-rate",
      preAllocatedVUs: 100, // Start with enough VUs to support RPS
      maxVUs: 1000, // Allow scale-up if needed
      stages: [
        { target: 3000, duration: "10m" },
        { target: 3000, duration: "5m" },
      ],
    },

    spike,
  },
};

export default function () {
  //get request
  //   console.log(`VU ${__VU} is running iteration ${__ITER}`);
  //   const req1 = "http://localhost:4000/comments";
  //   const response = http.get(req1);
  //   console.log(response.status);
  //   sleep(1);

  //post request
  const req2 = "http://localhost:4000/posts";
  const payLoad = JSON.stringify({
    title: "Basava",
    body: "bar",
    userId: 1,
    luckyNumber: Math.floor(Math.random() * 100),
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response2 = http.post(req2, payLoad, params);
}
