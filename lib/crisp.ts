export const crispReady = () =>
  typeof window !== 'undefined' && Array.isArray((window as any).$crisp);
const push = (cmd: any[]) => {
  if (crispReady()) (window as any).$crisp.push(cmd);
};
export const openChat = () => push(['do', 'chat:open']);
export const sendVisitorMessage = (t: string) =>
  push(['do', 'message:send', ['text', t]]);
export const addSessionTags = (tags: string[]) =>
  push(['set', 'session:segments', tags.map((t) => [t])]);
export const setSessionData = (pairs: Record<string, string | number>) =>
  push(['set', 'session:data', Object.entries(pairs)]);
export const identifyUser = (o: {
  email?: string;
  name?: string;
  phone?: string;
}) => {
  if (o.email) push(['set', 'user:email', o.email]);
  if (o.name) push(['set', 'user:nickname', o.name]);
  if (o.phone) push(['set', 'user:phone', o.phone]);
};
