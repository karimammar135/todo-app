export const getFutureDate = (minutes: number): Date => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + minutes * 60000); // 60000 ms in a minute
    return futureDate;
  };