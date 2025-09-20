from kafka import KafkaConsumer
import json

# Group ID needs to be distinct from server side consumer
# because message will be distributed with other consumer!!
consumer = KafkaConsumer(
    "pet-state-changes",
    bootstrap_servers=["localhost:29092", "localhost:39092", "localhost:49092"],
    group_id='client-state-changes-consumer', 
    key_deserializer=bytes.decode,
    value_deserializer=json.loads
)

for msg in consumer:
    print(f"Original Message: {msg}")
    print(f"Message Key: {msg.key} | Message Value: {msg.value}")
    print(f"Message key type: {type(msg.key)} | Message Value Type: {type(msg.value)}")
