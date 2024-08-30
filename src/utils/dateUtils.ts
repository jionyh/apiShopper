export const startAndEndOfMonth = (datetime:string)=>{
  const date = new Date(datetime);
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return {
    start,
    end
  };
}