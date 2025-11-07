import { Pricing } from "@/components/blocks/pricing";
import { auth } from "@/lib/auth";
import { getStripePlans } from "@/lib/stripe";
import { headers } from "next/headers";

export default async function Page() {
	const plans = await getStripePlans();

	const session = await auth.api.getSession({
        headers: await headers()
    });

	console.log({session})

	// const userId = session?.user.id!;
	// const customer_id = (await auth.api.getUser({
	// 	"query": {id: userId}
	// })).id;

	console.log({customer_id: "cus_TJ93qU3sQAy4N1"})
	return <Pricing plans={plans} customer_id={"cus_TJ93qU3sQAy4N1"} />;
}
