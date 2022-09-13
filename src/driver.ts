import { z, ZodSchema } from 'zod';
import { buildRedirectScript } from './utils/buildRedirectScript';

interface IPaymentInfo {
  referenceId: string | number;
  method: 'GET' | 'POST';
  url: string;
  params?: Record<string, any>;
}

export const baseConfigSchema = z.object({});

export type BaseConfigOptions = z.infer<typeof baseConfigSchema>;

export const baseRequestSchema = z.object({
  callbackUrl: z.string(),
  amount: z.number(),
  description: z.string().optional(),
});

export type BaseRequestOptions = z.infer<typeof baseRequestSchema>;

export const baseVerifySchema = z.object({
  amount: z.number(),
});

export type BaseVerifyOptions = z.infer<typeof baseVerifySchema>;

export interface Receipt<RawReceipt = any> {
  transactionId: string | number;
  cardPan?: string;
  raw: RawReceipt;
}

export const defineDriver = <
  DriverConfigSchema extends ZodSchema,
  DriverRequestSchema extends ZodSchema,
  DriverVerifySchema extends ZodSchema,
  IConfig extends z.infer<DriverConfigSchema> & BaseConfigOptions,
  IRequest extends z.infer<DriverRequestSchema> & BaseRequestOptions,
  IVerify extends z.infer<DriverVerifySchema> & BaseVerifyOptions,
  DefaultConfig extends Partial<IConfig>,
>({
  schema,
  defaultConfig,
  request,
  verify,
}: {
  schema: { config: DriverConfigSchema; request: DriverRequestSchema; verify: DriverVerifySchema };
  defaultConfig: DefaultConfig;
  request: (arg: { ctx: IConfig; options: IRequest }) => Promise<IPaymentInfo>;
  verify: (arg: { ctx: IConfig; options: IVerify; params: Record<string, any> }) => Promise<Receipt>;
}) => {
  return (config: Omit<IConfig, keyof DefaultConfig> & Partial<DefaultConfig>) => {
    const ctx: IConfig = schema.config.parse({ ...defaultConfig, ...config });

    const requestPayment = async (options: Parameters<typeof request>['0']['options']) => {
      options = schema.request.parse(options);
      const paymentInfo = await request({ ctx, options });
      return {
        ...paymentInfo,
        getScript: () => buildRedirectScript(paymentInfo.method, paymentInfo.url, paymentInfo.params),
      };
    };

    const verifyPayment = (
      options: Parameters<typeof verify>['0']['options'],
      params: Parameters<typeof verify>['0']['params'],
    ) => {
      options = schema.verify.parse(options);
      return verify({ ctx, options, params });
    };

    return {
      request: requestPayment,
      verify: verifyPayment,
      /**
       * @deprecated Please use request()
       */
      requestPayment,
      /**
       * @deprecated Please use verify()
       */
      verifyPayment,
    };
  };
};
