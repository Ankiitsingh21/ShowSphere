import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // Server side
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
      host: "ticketing.dev"
    });
  } else {
    // Client side
    console.log("building client for browser");
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
