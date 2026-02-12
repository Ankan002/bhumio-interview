"use client";

import { CodeBlock, CodeBlockCopyButton } from "@/components/ai/code-block";
import { DashboardProvider } from "@/components/providers/dashboard-provider";

const CODE = `
type EventType = "created" | "updated" | "deleted";

type Event = {
  id: string;
  timestamp: number;
  type: EventType;
};

type Item = {
  id: string;
};

export class EventProcessor {
  private items = new Map<string, Item>();
  private latestTimestamp = new Map<string, number>();

  handleEvent(event: Event) {
    const lastSeen =
      this.latestTimestamp.get(event.id) ?? -Infinity;

    if (event.timestamp <= lastSeen) {
      return;
    }

    this.latestTimestamp.set(
      event.id,
      event.timestamp
    );

    switch (event.type) {
      case "created":
      case "updated":
        this.items.set(event.id, {
          id: event.id,
        });
        break;

      case "deleted":
        this.items.delete(event.id);
        break;
    }
  }

  getActiveItems(): Item[] {
    return Array.from(this.items.values());
  }
}
`;

const REACT_USAGE_CODE = `const processorRef = useRef(new EventProcessor());

function onEvent(event) {
  processorRef.current.handleEvent(event);
  setItems(
    processorRef.current.getActiveItems()
  );
}`;

const EDGE_CASES = [
    {
        term: "Out-of-order arrival",
        description:
            "Events are applied only when timestamp is strictly greater than the last seen for that id; older arrivals are ignored.",
    },
    {
        term: "Duplicate events",
        description:
            "Same id + timestamp is treated as already seen and skipped, so duplicates do not change state.",
    },
    {
        term: "Late events",
        description:
            "Late-arriving events with a newer timestamp still win; stale updates are rejected by the timestamp check.",
    },
    {
        term: "Delete safety",
        description:
            "A delete is applied only if its timestamp is the latest for that id; out-of-order deletes do not remove newer creates/updates.",
    },
    {
        term: "Update before create",
        description:
            'An update (or create) with a newer timestamp will overwrite or create the item; no separate "create" required first.',
    },
    {
        term: "Infinite stream safety",
        description:
            "Bounded state: one entry per id in items and latestTimestamp; safe for unbounded event streams.",
    },
    {
        term: "Time complexity: O(1) per event",
        description:
            "Map get/set/delete and switch are constant time; getActiveItems() is O(n) in active item count.",
    },
] as const;

const AssignmentTwoScreen = () => {
    return (
        <DashboardProvider heading="Out of Order Events">
            <p className="text-sm text-muted-foreground mb-4">
                A function to handle out of order streamed events. [This is the
                second assignment for Bhumio]
            </p>

            <CodeBlock code={CODE} language="typescript" />

            <section className="mt-8 space-y-6">
                <h2 className="text-lg font-semibold tracking-tight">
                    Edge case considerations
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-base">
                    {EDGE_CASES.map(({ term, description }) => (
                        <li key={term} className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {term}
                            </span>
                            {" — "}
                            {description}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mt-8 space-y-3 pb-6">
                <h2 className="text-lg font-semibold tracking-tight">
                    How to use in React
                </h2>
                <CodeBlock
                    code={REACT_USAGE_CODE.trim()}
                    language="typescript"
                    showLineNumbers
                >
                    <CodeBlockCopyButton />
                </CodeBlock>
            </section>
        </DashboardProvider>
    );
};

export default AssignmentTwoScreen;
