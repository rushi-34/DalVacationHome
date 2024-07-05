export const getQuestionBank = async () => {
    try {
        const response = await fetch('https://mye6m3odesmzxhcqcbzjx3ih7y0oaigh.lambda-url.us-east-1.on.aws/');
        if(!response.ok) throw new Error('Failed to fetch question bank');
        const data = await response.json(); 
        return data;
    }catch (error) {
        console.error(error);
        throw error;
    }
};