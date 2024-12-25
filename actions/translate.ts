"use server";

import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";

const TmtClient = tencentcloud.tmt.v20180321.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TRANSLATE_KEY,
    secretKey: process.env.TRANSLATE_SECRET,
  },
  region: "ap-hongkong",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
};

const client = new TmtClient(clientConfig);

export async function translate(text: string, target: string, source = "en") {
  const params = {
    SourceText: text,
    Source: source,
    Target: target,
    ProjectId: 0,
  };

  const response = await client.TextTranslate(params);

  return response.TargetText;
}
