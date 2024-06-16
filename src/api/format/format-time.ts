export function formatDateTime(date: Date) {
  // 转换为 yyyy-mm-dd hh:mm:ss
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const shortcuts = [
  {
    text: '2010~2030',
    value: () => {
      const start = new Date(2010,2,14)
      const end = new Date(2030,2,14)
      return [start, end]
    }
  },
  {
    text: '6.14~6.18',
    value: () => {
      const start = new Date(2019,5,14)
      const end = new Date(2019,5,18)
      return [start, end]
    }
  },
  {
    text: '6.14~6.16',
    value: () => {
      const start = new Date(2019,5,14)
      const end = new Date(2019,5,16)
      return [start, end]
    }
  },
  {
    text: '6.16~6.18',
    value: () => {
      const start = new Date(2019,5,16)
      const end = new Date(2019,5,18)
      return [start, end]
    }
  },
  {
    text: 'This month',
    value: [new Date(), new Date()],
  },
  {
    text: 'This year',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0)
      return [start, end]
    },
  },
  {
    text: 'Last 6 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
]

export const options = [
  {
    value: 'sports',
    label: 'sports',
  },
  {
    value: 'news',
    label: 'news',
  },
  {
    value: 'autos',
    label: 'autos',
  },
  {
    value: 'foodanddrink',
    label: 'foodanddrink',
  },
  {
    value: 'finance',
    label: 'finance',
  },
  {
    value: 'music',
    label: 'music',
  },
  {
    value: 'lifestyle',
    label: 'lifestyle',
  },
  {
    value: 'weather',
    label: 'weather',
  },
  {
    value: 'health',
    label: 'health',
  },
  {
    value: 'video',
    label: 'video',
  },
  {
    value: 'movies',
    label: 'movies',
  },
  {
    value: 'tv',
    label: 'tv',
  },
  {
    value: 'travel',
    label: 'travel',
  },
  {
    value: 'entertainment',
    label: 'entertainment',
  },
  {
    value: 'kids',
    label: 'kids',
  },
  {
    value: 'europe',
    label: 'europe',
  },
  {
    value: 'northamerica',
    label: 'northamerica',
  },
  {
    value: 'adexperience',
    label: 'adexperience',
  },
]