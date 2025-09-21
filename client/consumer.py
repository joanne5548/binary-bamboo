from kafka import KafkaConsumer
import json

def kafka_consumer_thread(message_queue, stop_event):
    # Group ID needs to be distinct from server side consumer
    # because message will be distributed with other consumer!!
    consumer = KafkaConsumer(
        "pet-state-changes",
        bootstrap_servers=["localhost:29092", "localhost:39092", "localhost:49092"],
        group_id='client-state-changes-consumer', 
        key_deserializer=bytes.decode,
        value_deserializer=json.loads
    )

    while not stop_event.is_set():
        messages = consumer.poll(timeout_ms=100)
        for _, record in messages.items():
            message_queue.put(record)

    consumer.close()
