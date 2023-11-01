export const GetChunkData = (chunkSize, arr) => {
    let chunkData = [];
    for (let i = 0; i < arr?.length; i += chunkSize) {
        const chunks = arr?.slice(i, i + chunkSize);
        let len = chunkSize - (arr?.slice(i, i + chunkSize))?.length;
        chunkData?.push({ data: chunks, length: len });
    }
    return chunkData;
}