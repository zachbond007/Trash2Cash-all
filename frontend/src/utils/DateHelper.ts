export const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${month.toString().padStart(2, '0')}/${day
    .toString()
    .padStart(2, '0')}/${year}`;

  return formattedDate;
};

export const calculateTimeDifference = (
  createdAt: Date | string | undefined,
) => {
  if (!createdAt) {
    return;
  }
  const currentTime = new Date();
  const performedAtTime = new Date(createdAt);
  const userOffset = currentTime.getTimezoneOffset() * 60000;
  const timeDifference =
    (currentTime.getTime() - performedAtTime.getTime() + userOffset) / 1000;
  if (timeDifference <= 0) {
    return '';
  } else if (timeDifference < 60) {
    return Math.floor(timeDifference) + 's';
  } else if (timeDifference < 3600) {
    return Math.floor(timeDifference / 60) + 'm';
  } else if (timeDifference < 86400) {
    return Math.floor(timeDifference / 3600) + 'h';
  } else if (timeDifference < 2628000) {
    return Math.floor(timeDifference / 86400) + 'd';
  } else if (timeDifference < 31536000) {
    return Math.floor(timeDifference / 2628000) + 'mo';
  } else {
    return 'long time';
  }
};
