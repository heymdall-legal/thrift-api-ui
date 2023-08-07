import request from 'request-promise-native';
import { ParsedMethod } from 'thriftrw';
import { jsonNormalizerFilter } from '../utils/thriftJsonNormalizer';

interface PerformRequestParameters {
    method: ParsedMethod;
    messageName: string;
    endpoint: string;
    requestMessage: string;
    header: string;
    timeout: number;
    proxy?: string;
    ignoreSSLErrors: boolean;
}

const stringify = (data: any) => JSON.stringify(data, jsonNormalizerFilter, 4);

export async function performRequest(
    { method, messageName, endpoint, requestMessage, timeout, proxy, ignoreSSLErrors, header }: PerformRequestParameters
) {
    const params = JSON.parse(requestMessage);
    const { headers } = JSON.parse(header);
    const message = new method.ArgumentsMessage({
        id: 0,
        body: new method.Arguments(params),
        version: 1,
        name: messageName
    });

    const result = method.argumentsMessageRW.byteLength(message);
    const buffer = new Buffer(result.length);

    method.argumentsMessageRW.writeInto(message, buffer, 0);

    const promise = request({
        method: 'POST',
        uri: endpoint,
        body: buffer,
        encoding: null,
        headers: {
            ...headers,
            'Content-Type': 'application/x-thrift',
        },
        rejectUnauthorized: !ignoreSSLErrors,
        timeout,
        proxy
    });

    const res = await promise;
    const parsed = method.resultMessageRW.readFrom(res, 0);
    if (parsed.err) {
        throw stringify(parsed.err);
    }
    if (parsed.value.body.success) {
        return stringify(parsed.value.body.success);
    }
    throw stringify(parsed.value.body.e || parsed.value.body);
}
