import { useState } from "react";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { api } from "./lib/utils";

function App() {
  const [loading, setLoading] = useState(false);
  let algorithms = [
    { label: "Decision Trees", value: "trees" },
    { label: "Random Forest", value: "random_forest" },
  ] as { label: string; value: "trees" | "random_forest" }[];

  let [trainedModels, setTrainedModels] = useState({
    trees: { accuracy: undefined, result: undefined },
    random_forest: { accuracy: undefined, result: undefined },
  });

  let trainModel = async (algorithm: string) => {
    setLoading(true);
    let response = await api.get(`/${algorithm}/train`);
    let data = (await response.data) as { accuracy: string };
    setTrainedModels((prev) => ({
      ...prev,
      [algorithm]: { accuracy: data.accuracy },
    }));
    setLoading(false);
  };

  let onSubmit = async (
    algorithm: "trees" | "random_forest",
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let values = Object.fromEntries(data.entries());
    setLoading(true);
    let response = await api.post(`/${algorithm}/classify`, values);
    let result = (await response.data) as { class: string };
    setTrainedModels((prev) => ({
      ...prev,
      [algorithm]: { ...prev[algorithm], result: result.class },
    }));
    setLoading(false);
  };

  return (
    <main className="container flex flex-col items-center justify-center w-full h-screen gap-4 pb-4">
      <nav className="flex items-center justify-between w-full p-4 border-b">
        <h1 className="text-2xl font-semibold"> 💐 Flowers Classifier</h1>
        <div className="flex items-center gap-2">
          <Button asChild size={"icon"} variant={"ghost"}>
            <a
              href="https://github.com/elguarir/flower-classification-app"
              target="_blank"
            >
              <svg
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Button>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full gap-8 p-5 border rounded-lg lg:p-16 bg-neutral-100/30">
        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl font-semibold text-balance lg:text-4xl">
            Welcome to the Flowers Classifier
          </h2>
          <p className="font-medium max-w-prose max-md:text-sm text-balance">
            This app uses a machine learning model to classify flowers based on
            provided information. You can choose between different algorithms
            below.
          </p>
        </div>
        <div className="flex flex-col w-full max-w-lg gap-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <h3 className="text-lg font-semibold text-neutral-700">
              Available algorithms
            </h3>
          </div>
          <Tabs
            defaultValue={algorithms[0].value}
            className="flex flex-col w-full space-y-4"
          >
            <TabsList>
              <div className="flex flex-row items-center w-full gap-2">
                {algorithms.map((algorithm) => (
                  <TabsTrigger
                    className="w-full"
                    key={algorithm.value}
                    value={algorithm.value}
                  >
                    {algorithm.label}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            {algorithms.map((algorithm) => (
              <TabsContent
                key={algorithm.value}
                value={algorithm.value}
                className="w-full"
              >
                <div
                  key={algorithm.value}
                  className="flex flex-col w-full gap-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-neutral-700">
                      {algorithm.label}
                    </h3>
                    <Button onClick={() => trainModel(algorithm.value)}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="ml-2">Training...</span>
                        </>
                      ) : (
                        "Train model"
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-medium text-neutral-700">
                      Accuracy:
                    </p>
                    <p className="text-base font-semibold text-primary-600">
                      {trainedModels[algorithm.value]?.accuracy ?? "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" />
                  <h4 className="text-base font-semibold text-neutral-700">
                    Classify a flower
                  </h4>
                  <form onSubmit={(event) => onSubmit(algorithm.value, event)}>
                    <fieldset
                      className="flex flex-col gap-4"
                      disabled={
                        loading || !trainedModels[algorithm.value]?.accuracy
                      }
                    >
                      <div className="grid grid-cols-2 gap-x-2">
                        <Label className="grid w-full gap-2">
                          <span>Sepal Length</span>
                          <Input
                            type="number"
                            step="0.01"
                            name="sepal_length"
                            placeholder="Sepal Length"
                          />
                        </Label>

                        <Label className="grid w-full gap-2">
                          <span>Sepal Width</span>
                          <Input
                            type="number"
                            step="0.01"
                            name="sepal_width"
                            placeholder="Sepal Width"
                          />
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <Label className="grid w-full gap-2">
                          <span>Petal Length</span>
                          <Input
                            type="number"
                            step="0.01"
                            name="petal_length"
                            placeholder="Petal Length"
                          />
                        </Label>
                        <Label className="grid w-full gap-2">
                          <span>Petal Width</span>
                          <Input
                            type="number"
                            step="0.01"
                            name="petal_width"
                            placeholder="Petal Width"
                          />
                        </Label>
                      </div>

                      <Button size={"lg"} type="submit">
                        Classify
                      </Button>
                    </fieldset>
                  </form>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-medium text-neutral-700">
                      Result:
                    </p>
                    <p className="text-base font-semibold text-primary-600">
                      {trainedModels[algorithm.value]?.result ?? "N/A"}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export default App;
