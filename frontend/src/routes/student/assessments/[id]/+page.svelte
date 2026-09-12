<script lang="ts">
	import { Button, Badge, Modal } from '$lib/components';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { api } from '$lib/services/api';
	import { fade } from 'svelte/transition';

	let assessment: any = null;
	let attempt: any = null;
	let currentQuestionIndex = 0;
	let answers: Record<string, any> = {};
	let isLoading = true;
	let isSubmitting = false;
	let showSubmitModal = false;
	let timeRemaining = 0;
	let timerInterval: any = null;

	$: assessmentId = ($page.params as any).id;
	$: currentQuestion = assessment?.questions?.[currentQuestionIndex];
	$: progress = assessment?.questions ? ((currentQuestionIndex + 1) / assessment.questions.length) * 100 : 0;

	onMount(() => {
		loadAssessment();
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});

	async function loadAssessment() {
		isLoading = true;
		try {
			// Start attempt
			const attemptData = await api.post(`/assessments/assessments/${assessmentId}/start-attempt/`, {});
			attempt = attemptData;
			assessment = attemptData.assessment;
			
			// Start timer if timed
			if (assessment.time_limit_minutes) {
				timeRemaining = assessment.time_limit_minutes * 60;
				timerInterval = setInterval(() => {
					timeRemaining--;
					if (timeRemaining <= 0) {
						handleSubmit();
					}
				}, 1000);
			}
		} catch (e: any) {
			alert(e.message || "Failed to start assessment");
			window.location.href = '/student/dashboard';
		} finally {
			isLoading = false;
		}
	}

	function selectAnswer(questionId: string, answer: any) {
		answers[questionId] = answer;
	}

	function nextQuestion() {
		if (currentQuestionIndex < assessment.questions.length - 1) {
			currentQuestionIndex++;
		}
	}

	function previousQuestion() {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		}
	}

	function goToQuestion(index: number) {
		currentQuestionIndex = index;
	}

	async function handleSubmit() {
		if (timerInterval) clearInterval(timerInterval);
		
		isSubmitting = true;
		try {
			await api.post(`/assessments/attempts/${attempt.id}/submit/`, {
				answers: answers
			});
			alert("Assessment submitted successfully!");
			window.location.href = '/student/dashboard';
		} catch (e: any) {
			alert(e.message || "Failed to submit assessment");
		} finally {
			isSubmitting = false;
			showSubmitModal = false;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<svelte:head>
	<title>{assessment?.title || 'Assessment'} - ProSiya LMS</title>
</svelte:head>

<div class="assessment-layout">
	
	<main class="assessment-container">
		{#if isLoading}
			<div class="loading-overlay">
				<div class="loader"></div>
				<p>Preparing your assessment...</p>
			</div>
		{:else if assessment}
			<div class="assessment-header">
				<div class="header-left">
					<h1>{assessment.title}</h1>
					<Badge variant="navy">{assessment.questions.length} Questions</Badge>
				</div>
				<div class="header-right">
					{#if assessment.time_limit_minutes}
						<div class="timer" class:warning={timeRemaining < 300}>
							⏱️ {formatTime(timeRemaining)}
						</div>
					{/if}
					<Button variant="accent" on:click={() => showSubmitModal = true}>
						Submit Assessment
					</Button>
				</div>
			</div>

			<div class="assessment-body">
				<div class="question-navigation">
					<h3>Questions</h3>
					<div class="question-grid">
						{#each assessment.questions as q, idx}
							<button 
								class="question-nav-btn"
								class:active={idx === currentQuestionIndex}
								class:answered={answers[q.id]}
								on:click={() => goToQuestion(idx)}
							>
								{idx + 1}
							</button>
						{/each}
					</div>
					<div class="progress-info">
						<p>Progress: {Object.keys(answers).length} / {assessment.questions.length}</p>
						<div class="progress-bar">
							<div class="progress-fill" style="width: {(Object.keys(answers).length / assessment.questions.length) * 100}%"></div>
						</div>
					</div>
				</div>

				<div class="question-area" in:fade>
					{#if currentQuestion}
						<div class="question-card">
							<div class="question-header">
								<span class="question-number">Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
								<Badge variant="accent">{currentQuestion.points} points</Badge>
							</div>
							
							<div class="question-text">
								<p>{currentQuestion.question_text}</p>
							</div>

							<div class="answer-options">
								{#if currentQuestion.question_type === 'multiple_choice'}
									{#each currentQuestion.options as option}
										<label class="option-label">
											<input 
												type="radio" 
												name="question-{currentQuestion.id}"
												value={option}
												checked={answers[currentQuestion.id] === option}
												on:change={() => selectAnswer(currentQuestion.id, option)}
											/>
											<span class="option-text">{option}</span>
										</label>
									{/each}
								{:else if currentQuestion.question_type === 'true_false'}
									<label class="option-label">
										<input 
											type="radio" 
											name="question-{currentQuestion.id}"
											value="true"
											checked={answers[currentQuestion.id] === 'true'}
											on:change={() => selectAnswer(currentQuestion.id, 'true')}
										/>
										<span class="option-text">True</span>
									</label>
									<label class="option-label">
										<input 
											type="radio" 
											name="question-{currentQuestion.id}"
											value="false"
											checked={answers[currentQuestion.id] === 'false'}
											on:change={() => selectAnswer(currentQuestion.id, 'false')}
										/>
										<span class="option-text">False</span>
									</label>
								{:else if currentQuestion.question_type === 'short_answer'}
									<textarea 
										class="short-answer-input"
										bind:value={answers[currentQuestion.id]}
										placeholder="Type your answer here..."
										rows="4"
									></textarea>
								{/if}
							</div>

							<div class="question-navigation-btns">
								<Button 
									variant="outline" 
									disabled={currentQuestionIndex === 0}
									on:click={previousQuestion}
								>
									← Previous
								</Button>
								<Button 
									variant="navy" 
									disabled={currentQuestionIndex === assessment.questions.length - 1}
									on:click={nextQuestion}
								>
									Next →
								</Button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>

	<Modal 
		show={showSubmitModal} 
		title="Submit Assessment?" 
		on:close={() => showSubmitModal = false}
	>
		<div class="submit-confirmation">
			<p>You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{assessment?.questions.length}</strong> questions.</p>
			<p>Are you sure you want to submit your assessment?</p>
			<p class="warning-text">⚠️ You cannot change your answers after submission.</p>
		</div>
		<div slot="footer">
			<Button variant="outline" on:click={() => showSubmitModal = false}>Cancel</Button>
			<Button variant="accent" on:click={handleSubmit} disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit Assessment'}
			</Button>
		</div>
	</Modal>
</div>

<style>
	.assessment-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--color-bg-light);
	}

	.assessment-container {
		flex: 1;
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.assessment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.header-left h1 {
		font-size: 1.75rem;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}

	.header-right {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.timer {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		padding: 0.75rem 1.5rem;
		background: var(--color-bg-light);
		border-radius: var(--radius-md);
	}

	.timer.warning {
		background: #fee2e2;
		color: var(--color-error);
	}

	.assessment-body {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
	}

	.question-navigation {
		background: white;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		height: fit-content;
		position: sticky;
		top: 2rem;
	}

	.question-navigation h3 {
		margin-bottom: 1rem;
		color: var(--color-navy-dark);
	}

	.question-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.question-nav-btn {
		aspect-ratio: 1;
		border: 2px solid var(--color-border);
		background: white;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.question-nav-btn:hover {
		border-color: var(--color-accent);
	}

	.question-nav-btn.active {
		background: var(--color-navy-dark);
		color: white;
		border-color: var(--color-navy-dark);
	}

	.question-nav-btn.answered {
		background: var(--color-accent);
		color: var(--color-navy-dark);
		border-color: var(--color-accent);
	}

	.progress-info p {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin-bottom: 0.5rem;
	}

	.progress-bar {
		height: 8px;
		background: var(--color-bg-light);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-accent);
		transition: width 0.3s ease;
	}

	.question-area {
		background: white;
		padding: 2rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.question-card {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.question-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--color-border);
	}

	.question-number {
		font-weight: 700;
		color: var(--color-navy-dark);
	}

	.question-text p {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--color-text);
	}

	.answer-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option-label:hover {
		border-color: var(--color-accent);
		background: rgba(253, 185, 19, 0.05);
	}

	.option-label input[type="radio"] {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	.option-text {
		flex: 1;
		font-size: 1rem;
	}

	.short-answer-input {
		width: 100%;
		padding: 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: inherit;
		font-size: 1rem;
		resize: vertical;
	}

	.question-navigation-btns {
		display: flex;
		justify-content: space-between;
		padding-top: 1rem;
		border-top: 2px solid var(--color-border);
	}

	.submit-confirmation {
		padding: 1rem 0;
	}

	.submit-confirmation p {
		margin-bottom: 1rem;
	}

	.warning-text {
		color: var(--color-warning);
		font-weight: 600;
	}

	.loading-overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		gap: 1.5rem;
	}

	.loader {
		border: 4px solid var(--color-bg-light);
		border-top: 4px solid var(--color-accent);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 1024px) {
		.assessment-body {
			grid-template-columns: 1fr;
		}
		.question-navigation {
			position: static;
		}
	}
</style>
