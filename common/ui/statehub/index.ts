import { createApp } from 'vue';
import StatehubAgent from './statehub-agent.vue';
import { StatehubAgentExposed } from './type';
import { createDefer } from '/common/helper';

const agent = await createAgent();

export const createStatehub = agent.createStatehub;

function createAgent() {
  const defer = createDefer<StatehubAgentExposed>();
  const element = document.createElement('div');
  document.body.appendChild(element);
  const app = createApp(StatehubAgent, {
    prepare: (c: any) => {
      const exposed = {
        createStatehub: (props: any) => {
          return c(props);
        },
      };
      defer.resolve(exposed);
    },
  });
  app.mount(element);
  return defer.promise;
}
