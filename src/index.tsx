import { Context, Schema } from "koishi";
import {} from "koishi-plugin-canvas";

export const name = "mosaic";
export const inject = ["canvas", "puppeteer"];

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

async function scaleImage(ctx: Context, imageUrl: string): Promise<string> {
  const CANVAS_SIZE = 16;

  const image = await ctx.canvas.loadImage(imageUrl);
  const canvas = await ctx.canvas.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  const canvasCtx = canvas.getContext("2d");

  canvasCtx.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

  return await canvas.toDataURL("image/png");
}

export function apply(ctx: Context) {
  ctx.i18n.define("zh-CN", require("./locales/zh-CN"));

  ctx.command("mosaic <target:user>").action(async ({ session }, target) => {
    const targetUser = target
      ? await session.bot.getUser(target.split(":")[1])
      : session.event.user;
    const image = await scaleImage(ctx, targetUser.avatar);

    return (
      <html>
        <img
          style="image-rendering: pixelated; width: 512px; height: 512px"
          src={image}
        />
      </html>
    );
  });
}
