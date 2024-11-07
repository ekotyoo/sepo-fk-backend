export const paginateResponse = (data: [unknown[], number], page: number, limit: number) => {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
        status: "success",
        data: [...result],
        count: total,
        current_page: page,
        next_page: nextPage,
        prev_page: prevPage,
        last_page: lastPage,
    }
}