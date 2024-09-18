import Moralis from 'moralis';
import { NextResponse } from 'next/server'
import axios from 'axios';
import serpResults from '../../components/serpResults'
import getGroqChatCompletion from '../../components/getGroqChatCompletion'

export async function POST(req, res) {
    let passedValue = await new Response(req.body).text();
    let bodyreq = JSON.parse(passedValue);
    const { chain, address } = bodyreq
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }


    try {
        if (!Moralis.Core.isStarted) {
            await Moralis.start({
                apiKey: process.env.NEXT_PUBLIC_MORALIS_API,
            });
        }

        const response = await Moralis.EvmApi.token.getTokenPrice({
            "chain": chain,
            "include": "percent_change",
            "address": address
        });

        let query = `latest news about ${response.jsonResponse.tokenName} coin with token symbol ${response.jsonResponse.tokenSymbol}`

        const result = await serpResults(query);

        let textContent = '';

        result.organic.forEach((item, index) => {
            textContent += `Title: ${item.title}\nLink: ${item.link}\nSnippet: ${item.snippet}\n\n`;
        });

        const groqresult = await getGroqChatCompletion(textContent);



        return NextResponse.json({ response, groqresult }, { status: 200 })


    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error }, { status: 500 })
    }
}

