import { Composition, registerRoot } from "remotion";
// 修改 1：引入 registerRoot
import { MyVideo } from "./MyVideo";
import { TrigFunctionsDemo } from "./TrigFunctionsDemo";
import { WelcomeVideo } from "./WelcomeVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WelcomeVideo"
        component={WelcomeVideo}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TrigFunctionsDemo"
        component={TrigFunctionsDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

// 修改 2：必须注册根组件！没有这一句，CLI 工具找不到任何视频配置
registerRoot(RemotionRoot);
