import { ActionType } from "../services/RateLimiter";

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const token = process.env.INFLUXDB_TOKEN ?? "";
const url = "https://europe-west1-1.gcp.cloud2.influxdata.com";

const client = new InfluxDB({ url, token });

let org = `gustaw.daniel@gmail.com`;
let bucket = process.env.INFLUXDB_BUCKET ?? "";

let writeClient = client.getWriteApi(org, bucket, "ns");

let writeTimeout: NodeJS.Timeout | undefined = undefined;

export function writeInfluxLog(userId: string, action: ActionType, timeNanoSeconds: bigint, tags: string[] = []) {

  if (writeTimeout === undefined) {
    writeTimeout = setTimeout(async () => {
      await writeClient.flush();

      clearTimeout(writeTimeout);
      writeTimeout = undefined;
    }, 5000);
  }

  let point = new Point(action)
    .tag(...tags)
    .stringField("userId", userId)
    .intField("timeNanoSec", timeNanoSeconds);

  writeClient.writePoint(point);
}
