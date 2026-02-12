"use client";

import { DashboardProvider } from "@/components/providers";
import { useAssignmentFour } from "./hook";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Check, DollarSign, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const AssignmentFourScreen = () => {
    const { form, isValidatingThatLies, handleValidateThatLies } =
        useAssignmentFour();

    return (
        <DashboardProvider heading="Validation That Lies">
            <p className="text-sm text-muted-foreground">
                A validation that lies on the client side but not on the server
                side. [Assignment 4 for Bhumio]
            </p>
            <div className="w-full mt-8 flex flex-col items-center">
                <Card className="w-full max-w-[450px] p-5 rounded-md bg-card">
                    <Form {...form}>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                handleValidateThatLies();
                            }}
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    placeholder="ankan@abc.com"
                                                    {...field}
                                                />
                                                <InputGroupAddon>
                                                    <Mail />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage {...field} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    placeholder="200"
                                                    type="number"
                                                    {...field}
                                                />
                                                <InputGroupAddon>
                                                    <DollarSign />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage {...field} />
                                    </FormItem>
                                )}
                            />

                            <div className="mt-4 flex justify-end items-center">
                                <Button type="submit">
                                    {isValidatingThatLies ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Check />
                                    )}
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </DashboardProvider>
    );
};

export default AssignmentFourScreen;
