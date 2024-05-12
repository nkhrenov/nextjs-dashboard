import { providerMap } from "@/auth";
import { authenticateWithThirdPartyProvider } from "../lib/actions";
import { Button } from "./button";
import { useFormStatus } from "react-dom";

export default function LoginThirdParty() {
    return (
        providerMap.length != 0 && (
            <div className="flex flex-col gap-2">
                {Object.values(providerMap).map((provider) => {
                    const authenticateWithThirdPartyProviderWithId = authenticateWithThirdPartyProvider.bind(null, provider.id);
                    return (
                        <div key={provider.id}>
                            <form
                                action={authenticateWithThirdPartyProviderWithId}
                            >
                                <Button className="mt-4 w-full">
                                    <span>Sign in with {provider.name}</span>
                                </Button>
                            </form>
                        </div>

                    )
                })}
            </div>
        )
    )
}