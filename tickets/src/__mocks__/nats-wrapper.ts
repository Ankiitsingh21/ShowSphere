export const natsWrapper = {
  client: {
    publishd: (subject: string, data: string, callback: () => void) => {
      callback();
    },
  },
};
