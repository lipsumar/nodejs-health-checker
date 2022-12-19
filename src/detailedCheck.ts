import { ApplicationConfig, ApplicationHealthDetailed, Integration } from "./interfaces/types";
import { getDeltaTime, resolveHost } from "./lib";

/**
 * HealthcheckerDetailedCheck perform a check for each integration informed
 *
 * @param config ApplicationConfig
 * @return ApplicationHealthDetailed
 */
export async function HealthcheckerDetailedCheck(config: ApplicationConfig): Promise<ApplicationHealthDetailed> {
  const promisesList: Promise<Integration>[] = [];
  const start = new Date().getTime();
  config.integrations.forEach((item) => {
    promisesList.push(item.check(resolveHost(item)));
  });
  const results = await Promise.all(promisesList);
  const integrations = results.map((item) => item);
  return {
    name: config.name || "",
    version: config.version || "",
    status: !integrations.some(({ status: Status }) => Status === false),
    date: new Date(),
    duration: getDeltaTime(start),
    integrations,
  };
}
