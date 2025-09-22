const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: "https://my-elasticsearch-project-f4e05e.es.us-central1.gcp.elastic.cloud:443",
  auth: {
    apiKey: "SEZENVVwa0JNSndUZXNjVlBiWHM6UzVKbE56eHB1dTZMeE1RRWRxN0RlQQ==", 
  },
});

// Hàm test kết nối
const pingES = async () => {
  try {
    await esClient.ping();
    console.log("Elasticsearch connected!");
  } catch (error) {
    console.error("Error connecting to Elasticsearch:", error);
  }
};

module.exports = { esClient, pingES };
