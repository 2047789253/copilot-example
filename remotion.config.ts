import { Config } from "@remotion/cli/config";

// Set default codec
Config.setCodec("h264");
Config.setX264Preset("ultrafast");

// Set default output location
Config.setOutputLocation("output.mp4");

// Optionally, set dimensions
Config.overrideWidth(1920);
Config.overrideHeight(1080);
