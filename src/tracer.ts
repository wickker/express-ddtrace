import tracer from "dd-trace";

tracer.init({
	logInjection: true,
    port: 9529
});

export default tracer;
