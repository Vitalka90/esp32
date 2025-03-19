class ESPLoader {
    constructor(baudRate = 115200, chip = "esp32") {
        this.baudRate = baudRate;
        this.chip = chip;
        this.port = null;
        this.reader = null;
        this.writer = null;
    }

    async connect() {
        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: this.baudRate });
            this.writer = this.port.writable.getWriter();
            this.reader = this.port.readable.getReader();
            console.log("ESP32 verbunden");
        } catch (error) {
            console.error("Fehler beim Verbinden mit ESP32:", error);
        }
    }

    async disconnect() {
        if (this.reader) {
            await this.reader.cancel();
            this.reader = null;
        }
        if (this.writer) {
            await this.writer.close();
            this.writer = null;
        }
        if (this.port) {
            await this.port.close();
            this.port = null;
        }
        console.log("ESP32 getrennt");
    }

    async flash(firmware) {
        if (!this.port || !this.writer) {
            console.error("ESP32 ist nicht verbunden");
            return;
        }
        console.log("Starte Flash-Vorgang...");
        for (const segment of firmware) {
            console.log(`Sende Daten an Adresse: ${segment.address.toString(16)}`);
            await this.writer.write(segment.data);
        }
        console.log("Flash-Vorgang abgeschlossen");
    }
}
