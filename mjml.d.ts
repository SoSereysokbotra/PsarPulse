declare module "mjml" {
  type MjmlOptions = {
    validationLevel?: "strict" | "soft" | "skip";
  };

  type MjmlResult = {
    html: string;
    errors: Array<{
      line?: number;
      message: string;
      tagName?: string;
      formattedMessage?: string;
    }>;
  };

  export default function mjml2html(
    mjml: string,
    options?: MjmlOptions,
  ): MjmlResult;
}
