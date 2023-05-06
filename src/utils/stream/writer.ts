export type WriterEvent = "error" | "message" | "end";

export function writeOnStream(writer: WritableStreamDefaultWriter, event: WriterEvent, data: any) {
    const encoder = new TextEncoder();

    const id = new Date().getMilliseconds();

    writer.write(encoder.encode(`id: ${id}\n`));
    writer.write(encoder.encode(`event: ${event}\n`));
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}