<script lang="ts">
    import { onMount } from 'svelte';
    import { courseService } from '$lib/services/courses';
    import Button from '$lib/components/Button.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import Badge from '$lib/components/Badge.svelte';

    let courses: any[] = [];
    let showModal = false;
    let isEditing = false;
    let loading = false;
    
    let formData = {
        title: '',
        slug: '',
        short_description: '',
        description: '',
        category: 'security',
        level: 'beginner',
        price: 0,
        currency: 'ZAR',
        status: 'draft',
        duration_hours: 0
    };

    onMount(async () => {
        await loadCourses();
    });

    async function loadCourses() {
        try {
            const response = await courseService.getCourses();
            if (response.data && Array.isArray(response.data.results)) {
                courses = response.data.results;
            } else if (Array.isArray(response.data)) {
                 courses = response.data;
            } else {
                 courses = [];
            }
        } catch (e) {
            console.error('Failed to load courses', e);
        }
    }

    function openCreateModal() {
        formData = {
            title: '',
            slug: '',
            short_description: '',
            description: '',
            category: 'security',
            level: 'beginner',
            price: 0,
            currency: 'ZAR',
            status: 'draft',
            duration_hours: 0
        };
        isEditing = false;
        showModal = true;
    }

    function openEditModal(course: any) {
        formData = { ...course };
        isEditing = true;
        showModal = true;
    }

    async function handleSubmit() {
        loading = true;
        try {
            if (isEditing) {
                // If ID is needed or Slug, use existing.
                await courseService.updateCourse(formData.slug, formData);
            } else {
                await courseService.createCourse(formData);
            }
            showModal = false;
            await loadCourses();
        } catch (e: any) {
            alert('Error saving course: ' + (e.message || 'Unknown error'));
        } finally {
            loading = false;
        }
    }

    async function handleDelete(slug: string) {
        if(!confirm('Are you sure you want to delete this course?')) return;
        try {
            await courseService.deleteCourse(slug);
            await loadCourses();
        } catch (e) {
            alert('Error deleting course');
        }
    }

    // Auto-generate slug from title
    $: if (!isEditing && formData.title) {
        formData.slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
</script>

<div class="admin-page">
    <div class="header-actions">
        <div>
            <h1>Course Management</h1>
            <p class="subtitle">Manage courses, curricula, and enrollments</p>
        </div>
        <Button variant="accent" on:click={openCreateModal}>+ Create New Course</Button>
    </div>

    <div class="course-list-container">
        {#if courses.length === 0}
            <div class="empty-state">
                <p>No courses found. Create your first course!</p>
            </div>
        {:else}
            <table class="course-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each courses as course}
                        <tr>
                            <td class="font-medium">{course.title}</td>
                            <td><span class="category-tag">{course.category}</span></td>
                            <td>
                                <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
                                    {course.status}
                                </Badge>
                            </td>
                            <td>{course.currency} {course.price}</td>
                            <td>{course.duration_hours}h</td>
                            <td class="text-right">
                                <button class="action-btn edit" on:click={() => openEditModal(course)}>Edit</button>
                                <button class="action-btn delete" on:click={() => handleDelete(course.slug)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>

    <Modal bind:isOpen={showModal} title={isEditing ? 'Edit Course' : 'Create New Course'}>
        <form on:submit|preventDefault={handleSubmit} class="course-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="title">Course Title</label>
                    <input id="title" type="text" bind:value={formData.title} required placeholder="e.g. Basic Security Training" />
                </div>
                <div class="form-group">
                    <label for="slug">Slug (URL)</label>
                    <input id="slug" type="text" bind:value={formData.slug} required />
                </div>
            </div>

            <div class="form-group">
                <label for="short_description">Short Description</label>
                <input id="short_description" type="text" bind:value={formData.short_description} required />
            </div>

            <div class="form-group">
                <label for="description">Full Description</label>
                <textarea id="description" bind:value={formData.description} rows="4"></textarea>
            </div>

            <div class="form-row three-col">
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" bind:value={formData.category}>
                        <option value="security">Security</option>
                        <option value="firearm">Firearm</option>
                        <option value="first_aid">First Aid</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="level">Level</label>
                    <select id="level" bind:value={formData.level}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" bind:value={formData.status}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="price">Price</label>
                    <input id="price" type="number" bind:value={formData.price} min="0" step="0.01" />
                </div>
                <div class="form-group">
                    <label for="duration">Duration (Hours)</label>
                    <input id="duration" type="number" bind:value={formData.duration_hours} min="0" />
                </div>
            </div>

            <div class="form-actions">
                <Button variant="primary" type="button" on:click={() => showModal = false}>Cancel</Button>
                <Button variant="accent" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
                </Button>
            </div>
        </form>
    </Modal>
</div>

<style>
    .admin-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h1 {
        margin: 0;
        font-size: 1.8rem;
        color: var(--color-navy-dark);
    }

    .subtitle {
        margin: 0.5rem 0 0;
        color: var(--color-text-light);
    }

    .course-list-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .course-table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1rem 1.5rem;
        text-align: left;
        border-bottom: 1px solid #f3f4f6;
    }

    th {
        background: #f9fafb;
        font-weight: 600;
        color: var(--color-navy);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tr:hover {
        background-color: #f9fafb;
    }

    .font-medium {
        font-weight: 500;
    }

    .category-tag {
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        text-transform: capitalize;
    }

    .text-right {
        text-align: right;
    }

    .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.15s;
    }

    .action-btn.edit {
        color: var(--color-navy);
    }

    .action-btn.edit:hover {
        color: var(--color-accent);
    }

    .action-btn.delete {
        color: #ef4444;
        margin-left: 0.5rem;
    }

    .action-btn.delete:hover {
        color: #dc2626;
    }

    .empty-state {
        padding: 3rem;
        text-align: center;
        color: var(--color-text-light);
    }

    /* Form Styles */
    .course-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 0.5rem;
    }

    .form-row {
        display: flex;
        gap: 1rem;
    }

    .three-col {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-navy);
    }

    input, select, textarea {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.95rem;
        width: 100%;
        box-sizing: border-box;
    }

    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: var(--color-navy);
        box-shadow: 0 0 0 2px rgba(26, 35, 50, 0.1);
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
    }

    @media (max-width: 768px) {
        .form-row {
            flex-direction: column;
        }
        .three-col {
            grid-template-columns: 1fr;
        }
    }
</style>
