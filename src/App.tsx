import { AppMenubar } from "@/components/app-menubar.tsx";
import { TypedDataTable } from "@/components/table/typed-data-table";
import { RefValueHeaders } from "@/config/base";
import { queryNamedIdList } from "@/config/config";
import { useCacheStore } from "@/store/cacheStore";
import { useConfigStore } from "@/store/configStore";

function App() {
    const refValueTab = useCacheStore((state) => state.refValueTab);
    const config = useConfigStore((state) => state.config);

    return (
        <div>
            <AppMenubar />
            <div className="rounded-[0.5rem] border bg-background shadow m-5 p-5">
                <TypedDataTable
                    type={refValueTab}
                    headers={RefValueHeaders[refValueTab]}
                    data={queryNamedIdList(config, refValueTab)}
                />
            </div>
        </div>
    );
}

export default App;
