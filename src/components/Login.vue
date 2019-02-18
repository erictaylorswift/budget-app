<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>

        <section>
            <div class="main-container">
                    <form v-if="showLoginForm" @submit.prevent >
                        <div class="flex bottom margin-bottom">
                            <i class="nes-ash"></i>
                            <h1 class="space">Sign in to view budget</h1>
                        </div>
                        <div class="flex-column one-third">
                            <label for="email1">Email</label>
                            <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" >

                            <label for="password1">Password</label>
                            <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" >
                            <button 
                                @click="login" 
                                class="nes-btn is-primary login"
                            >
                                Log In
                            </button>
                            <a @click="toggleForgotPasswordReset" class="login">Forgot Password</a>
                        </div>
                    </form>
                <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <h1>Reset Password</h1>
                        <p>We will send you an email to reset your password</p>

                        <label for="email3">Email</label>
                        <input v-model.trim="passwordForm.email" type="text" placeholder="you@email.com" id="email3">

                        <button @click="resetPassword" class="button">Submit</button>

                        <div class="extras">
                            <a @click="toggleForgotPasswordReset">Back To Log In</a>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email Sent</h1>
                        <p>check your email for a link to reset your password</p>
                        <button @click="toggleForgotPasswordReset" class="button">Back to login</button>
                    </div>
                </form>
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig');

    export default {
        data() {
            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                passwordForm: {
                    email: ''
                },
                myCroppa: {},
                showLoginForm: true,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForgotPasswordReset() {
                this.errorMsg = ''
                this.showLoginForm = !this.showLoginForm
                this.showForgotPassword = !this.showForgotPassword
            },
            login() {
                this.performingRequest = true;

                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
                    .then(user => {
                        this.$store.commit('setCurrentUser', user.user)
                        this.performingRequest = false
                        this.$router.push('/home')
                    }).catch(err => {
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
            },
            resetPassword() {
                this.performingRequest = true

                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                }).catch(err => {
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }
        }

    }
</script>