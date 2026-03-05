import tracer from "dd-trace";

tracer.init({
	logInjection: true,
    port: 9529,
    service: "dian-express-app",
    version: "1.0.0"
});

export default tracer;
