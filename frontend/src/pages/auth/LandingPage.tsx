import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const LandingPage = () => {
	const [activeKanbanCard, setActiveKanbanCard] = useState<string | null>(null);
	const [emailStatus, setEmailStatus] = useState("");

	useEffect(() => {
		const tailwindScriptId = "opportrack-tailwind-cdn";
		const fontAwesomeId = "opportrack-fa-cdn";
		const interFontId = "opportrack-inter-font";

		if (!document.getElementById(interFontId)) {
			const interFontLink = document.createElement("link");
			interFontLink.id = interFontId;
			interFontLink.rel = "stylesheet";
			interFontLink.href =
				"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
			document.head.appendChild(interFontLink);
		}

		if (!document.getElementById(fontAwesomeId)) {
			const fontAwesomeLink = document.createElement("link");
			fontAwesomeLink.id = fontAwesomeId;
			fontAwesomeLink.rel = "stylesheet";
			fontAwesomeLink.href =
				"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
			document.head.appendChild(fontAwesomeLink);
		}

		if (!document.getElementById(tailwindScriptId)) {
			const tailwindScript = document.createElement("script");
			tailwindScript.id = tailwindScriptId;
			tailwindScript.src = "https://cdn.tailwindcss.com";
			document.head.appendChild(tailwindScript);
		}

		const draggableCards = Array.from(document.querySelectorAll(".draggable-card"));
		const cleanupFns: Array<() => void> = [];

		draggableCards.forEach((card) => {
			const element = card as HTMLElement;
			let pointerDown = false;

			const handlePointerDown = () => {
				pointerDown = true;
				element.style.cursor = "grabbing";
				element.style.transform = "translateY(-8px) scale(1.02) rotate(-1deg)";
			};

			const handlePointerUp = () => {
				pointerDown = false;
				element.style.cursor = "grab";
				element.style.transform = "";
			};

			const handlePointerMove = (event: PointerEvent) => {
				if (!pointerDown) {
					return;
				}
				const { movementX, movementY } = event;
				element.style.transform = `translate(${Math.min(
					Math.max(movementX * 0.5, -6),
					6,
				)}px, ${Math.min(Math.max(movementY * 0.5, -6), 6)}px) scale(1.02)`;
			};

			element.addEventListener("pointerdown", handlePointerDown);
			element.addEventListener("pointerup", handlePointerUp);
			element.addEventListener("pointerleave", handlePointerUp);
			element.addEventListener("pointermove", handlePointerMove);

			cleanupFns.push(() => {
				element.removeEventListener("pointerdown", handlePointerDown);
				element.removeEventListener("pointerup", handlePointerUp);
				element.removeEventListener("pointerleave", handlePointerUp);
				element.removeEventListener("pointermove", handlePointerMove);
			});
		});

		return () => {
			cleanupFns.forEach((cleanup) => cleanup());
		};
	}, []);

	const handleSignup = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setEmailStatus("Thanks! You are on the early access list.");
	};

	return (
		<div
			className="min-h-screen bg-[#050816] text-slate-100"
			style={{ fontFamily: "Inter, sans-serif" }}
		>
			<style>
				{`
					:root {
						--ot-blue: #00b3ff;
						--ot-purple: #6d4dff;
						--ot-ink: #050816;
					}

					.bg-radial-grid {
						background-image:
							radial-gradient(circle at 20% 20%, rgba(109, 77, 255, 0.25), transparent 35%),
							radial-gradient(circle at 80% 0%, rgba(0, 179, 255, 0.2), transparent 40%),
							linear-gradient(to bottom, rgba(8, 14, 36, 0.95), rgba(5, 8, 22, 1));
					}

					.glass {
						background: rgba(14, 20, 45, 0.62);
						backdrop-filter: blur(14px);
						border: 1px solid rgba(129, 140, 248, 0.2);
						box-shadow: 0 20px 55px rgba(2, 10, 28, 0.45);
					}

					.glow-border {
						position: relative;
						overflow: hidden;
					}

					.glow-border::before {
						content: "";
						position: absolute;
						inset: -1px;
						background: linear-gradient(120deg, rgba(0, 179, 255, 0.42), rgba(109, 77, 255, 0.4));
						z-index: -1;
						filter: blur(8px);
						opacity: 0;
						transition: opacity 280ms ease;
					}

					.glow-border:hover::before {
						opacity: 1;
					}

					.section-fade {
						animation: sectionFadeIn 0.8s ease both;
					}

					@keyframes sectionFadeIn {
						from {
							opacity: 0;
							transform: translateY(16px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					.float-hero {
						animation: floatHero 5s ease-in-out infinite;
					}

					@keyframes floatHero {
						0%,
						100% {
							transform: translateY(0px);
						}
						50% {
							transform: translateY(-8px);
						}
					}
				`}
			</style>

			<div className="bg-radial-grid">
				<main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
					<section className="section-fade grid items-center gap-10 py-14 md:grid-cols-2">
						<div>
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/10 px-4 py-1 text-xs font-medium text-indigo-200">
								<i className="fa-solid fa-briefcase"></i>
								Built for job seekers, not generic project tools
							</div>
							<h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
								Turn Your Job Search Into a
								<span className="bg-linear-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
									{" "}
									Winning Strategy
								</span>
							</h1>
							<p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
								OpporTrack transforms messy applications into a clear, visual pipeline. Organize
								every opportunity, prep interviews faster, and move from applied to offer with
								confidence.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-4">
								<button className="rounded-xl bg-linear-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30">
									Get Started Free
								</button>
								<button className="rounded-xl border border-slate-600/70 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:bg-slate-800/70">
									See Live Demo
								</button>
							</div>
						</div>

						<div className="float-hero rounded-2xl p-1">
							<div className="glass rounded-2xl p-5">
								<div className="mb-4 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-cyan-200">Job Hunt Board Preview</h3>
									<span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200">
										Live Workflow
									</span>
								</div>
								<div className="grid gap-3 md:grid-cols-4">
									{[
										"Applied",
										"Interview",
										"Offer",
										"Rejected",
									].map((stage) => (
										<div key={stage} className="rounded-xl border border-slate-700/70 bg-slate-900/50 p-3">
											<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
												{stage}
											</p>
											<div className="space-y-2 text-xs">
												<div className="rounded-lg bg-slate-800/80 p-2 text-slate-200">{stage} Card 1</div>
												<div className="rounded-lg bg-slate-800/50 p-2 text-slate-400">{stage} Card 2</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>

					<section className="section-fade py-10">
						<div className="mb-8 text-center">
							<h2 className="text-3xl font-bold">Everything You Need to Run Your Job Hunt</h2>
							<p className="mt-2 text-slate-400">Six focused tools designed for faster outcomes</p>
						</div>
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{[
								{ icon: "fa-table-columns", title: "Kanban Board", desc: "Track each application with flexible drag-and-drop lanes." },
								{ icon: "fa-magnifying-glass", title: "Smart Job Discovery", desc: "Search and scrape fresh openings by role, stack, or location." },
								{ icon: "fa-calendar-check", title: "Interview Scheduler", desc: "Set reminders for interviews, follow-ups, and prep sessions." },
								{ icon: "fa-chart-line", title: "Analytics Dashboard", desc: "Visualize response rates, interview stages, and conversion trends." },
								{ icon: "fa-tags", title: "Tag & Filter", desc: "Filter applications by company, salary band, or role fit instantly." },
								{ icon: "fa-people-group", title: "Collaboration Mode", desc: "Share progress with mentors, recruiters, or accountability partners." },
							].map((feature) => (
								<article
									key={feature.title}
									className="glass glow-border rounded-2xl p-5 transition duration-300 hover:-translate-y-1"
								>
									  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/30 to-indigo-500/30 text-cyan-200">
										<i className={`fa-solid ${feature.icon}`}></i>
									</div>
									<h3 className="text-lg font-semibold">{feature.title}</h3>
									<p className="mt-2 text-sm text-slate-300">{feature.desc}</p>
								</article>
							))}
						</div>
					</section>

					<section className="section-fade py-14">
						<h2 className="text-center text-3xl font-bold">How It Works</h2>
						<div className="mt-8 grid gap-5 md:grid-cols-3">
							{[
								{ step: "01", title: "Discover Jobs", text: "Find matching opportunities with smart search and curated listings." },
								{ step: "02", title: "Track Progress", text: "Move cards through every hiring stage with status clarity." },
								{ step: "03", title: "Land the Role", text: "Use reminders and insights to convert more interviews into offers." },
							].map((item) => (
								<div key={item.step} className="glass rounded-2xl p-6 text-center">
									<p className="text-sm font-semibold text-cyan-300">Step {item.step}</p>
									<h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
									<p className="mt-2 text-sm text-slate-300">{item.text}</p>
								</div>
							))}
						</div>
					</section>

					<section className="section-fade py-10">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-3xl font-bold">Interactive Kanban Preview</h2>
							<span className="text-sm text-slate-400">Click a card to highlight details</span>
						</div>
						<div className="grid gap-4 lg:grid-cols-4">
							{[
								{
									column: "Applied",
									cards: [
										{ id: "a1", company: "Notion", role: "Product Analyst", salary: "$80k", badge: "New" },
										{ id: "a2", company: "Stripe", role: "Junior PM", salary: "$92k", badge: "Follow-up" },
									],
								},
								{
									column: "Interview",
									cards: [
										{ id: "i1", company: "Airbnb", role: "Ops Specialist", salary: "$95k", badge: "Round 2" },
										{ id: "i2", company: "Atlassian", role: "Support PM", salary: "$88k", badge: "Prep" },
									],
								},
								{
									column: "Offer",
									cards: [
										{ id: "o1", company: "Canva", role: "Project Coordinator", salary: "$104k", badge: "Offer" },
									],
								},
								{
									column: "Rejected",
									cards: [
										{ id: "r1", company: "Dropbox", role: "Associate PM", salary: "$90k", badge: "Closed" },
									],
								},
							].map((lane) => (
								<div key={lane.column} className="glass rounded-2xl p-4">
									<h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-200">
										{lane.column}
									</h3>
									<div className="space-y-3">
										{lane.cards.map((job) => (
											<button
												key={job.id}
												type="button"
												onClick={() => setActiveKanbanCard(job.id)}
												className={`draggable-card w-full cursor-grab rounded-xl border p-3 text-left transition duration-200 ${
													activeKanbanCard === job.id
														? "border-cyan-300 bg-cyan-400/10"
														: "border-slate-700 bg-slate-900/70 hover:border-indigo-300/50"
												}`}
											>
												<p className="font-semibold text-slate-100">{job.company}</p>
												<p className="text-sm text-slate-300">{job.role}</p>
												<div className="mt-2 flex items-center justify-between text-xs">
													<span className="text-cyan-300">{job.salary}</span>
													<span className="rounded-full bg-indigo-500/20 px-2 py-1 text-indigo-200">
														{job.badge}
													</span>
												</div>
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					</section>

					<section className="section-fade py-12">
						<div className="glass grid gap-4 rounded-2xl px-6 py-5 text-center sm:grid-cols-3 sm:text-left">
							<div>
								<p className="text-2xl font-extrabold text-cyan-300">10,000+</p>
								<p className="text-sm text-slate-300">Jobs Tracked</p>
							</div>
							<div>
								<p className="text-2xl font-extrabold text-indigo-300">3x Faster</p>
								<p className="text-sm text-slate-300">Hiring Outcomes</p>
							</div>
							<div>
								<p className="text-2xl font-extrabold text-violet-300">500+</p>
								<p className="text-sm text-slate-300">Companies in Pipeline</p>
							</div>
						</div>
					</section>

					<section className="section-fade py-10">
						<h2 className="text-center text-3xl font-bold">Simple Pricing, Real Momentum</h2>
						<div className="mt-8 grid gap-5 lg:grid-cols-3">
							{[
								{
									tier: "Free",
									price: "$0",
									features: ["Up to 30 jobs", "Basic Kanban board", "Manual reminders"],
								},
								{
									tier: "Pro",
									price: "$9/mo",
									features: ["Unlimited jobs", "Smart discovery + analytics", "Auto reminders + calendar sync"],
									highlight: true,
								},
								{
									tier: "Team",
									price: "$29/mo",
									features: ["All Pro features", "Mentor/recruiter collaboration", "Shared dashboards and notes"],
								},
							].map((plan) => (
								<div
									key={plan.tier}
									className={`glass rounded-2xl p-6 ${plan.highlight ? "border-cyan-300/50" : ""}`}
								>
									<h3 className="text-xl font-semibold">{plan.tier}</h3>
									<p className="mt-2 text-3xl font-extrabold text-cyan-300">{plan.price}</p>
									<ul className="mt-4 space-y-2 text-sm text-slate-300">
										{plan.features.map((feature) => (
											<li key={feature} className="flex items-start gap-2">
												<i className="fa-solid fa-check mt-1 text-xs text-emerald-300"></i>
												<span>{feature}</span>
											</li>
										))}
									</ul>
									  <button className="mt-6 w-full rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
										Choose {plan.tier}
									</button>
								</div>
							))}
						</div>
					</section>

					<section className="section-fade py-10">
						<h2 className="text-center text-3xl font-bold">Success Stories</h2>
						<div className="mt-8 grid gap-5 md:grid-cols-3">
							{[
								{
									quote:
										"OpporTrack turned my chaotic spreadsheet into a system. I landed 2 offers in 6 weeks.",
									person: "Nimal P.",
									role: "Frontend Developer",
								},
								{
									quote:
										"The reminders and board view helped me follow up consistently. My interview rate doubled.",
									person: "Ayesha R.",
									role: "Data Analyst",
								},
								{
									quote:
										"I shared my board with a mentor and fixed my weak points quickly. Best job hunt tool I used.",
									person: "Kavindu L.",
									role: "Product Associate",
								},
							].map((item) => (
								<article key={item.person} className="glass rounded-2xl p-6">
									<p className="text-sm leading-relaxed text-slate-200">“{item.quote}”</p>
									<p className="mt-4 font-semibold text-cyan-200">{item.person}</p>
									<p className="text-xs text-slate-400">{item.role}</p>
								</article>
							))}
						</div>
					</section>

					<section className="section-fade py-16">
						<div className="glass rounded-2xl bg-linear-to-r from-indigo-500/25 to-cyan-500/20 p-8 text-center">
							<h2 className="text-3xl font-extrabold">Start tracking your dream job today</h2>
							<p className="mx-auto mt-3 max-w-2xl text-slate-300">
								Join professionals using OpporTrack to stay organized, focused, and interview-ready.
							</p>
							<form
								onSubmit={handleSignup}
								className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
							>
								<input
									type="email"
									required
									placeholder="Enter your email"
									className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
								/>
								<button
									type="submit"
									  className="rounded-xl bg-linear-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
								>
									Get Early Access
								</button>
							</form>
							{emailStatus && <p className="mt-3 text-sm text-emerald-300">{emailStatus}</p>}
						</div>
					</section>
				</main>
			</div>
		</div>
	);
};

export default LandingPage;
