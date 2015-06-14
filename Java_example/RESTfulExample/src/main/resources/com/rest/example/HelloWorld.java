import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("/hello")
public class HelloWorld {
	@GET
	@Path("{name}")
	public Response sayHello(@PathParam("name") String name) {
		String output = "Hello, " + name + "!";
		return Response.status(200).entity(output).build();
	}
}
