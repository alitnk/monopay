import { PaymentInfo } from './types';

export const getScript = (paymentInfo: PaymentInfo) => {
  const { method, params, url } = paymentInfo;
  let script = `
var form = document.createElement("form");
form.setAttribute("method", "${method}");
form.setAttribute("action", "${url}");
form.setAttribute("target", "_self");
`;
  Object.keys(params).forEach(key => {
    const value = params[key];
    script += `
var polypay_hidden_field__${key} = document.createElement("input");
polypay_hidden_field__${key}.setAttribute("name", ${key});
polypay_hidden_field__${key}.setAttribute("value", ${value});
form.appendChild(polypay_hidden_field__${key});
`;
  });

  script += `
document.body.appendChild(form);
form.submit();
document.body.removeChild(form);
`;
  return script;
};
