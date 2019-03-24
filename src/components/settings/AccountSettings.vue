<template>
  <div class="fields">
    <div class="separator">
      <md-avatar class="md-large">
        <img :src="userPhoto" v-if="userPhoto" />
        <img
          v-else
          src="https://api.adorable.io/avatars/285/abott@adorable.png"
        />
      </md-avatar>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-66">
        <md-field>
          <label>New password</label>
          <md-input v-model="newPassword" type="password"></md-input>
        </md-field>
        <md-field>
          <label>Confirm password</label>
          <md-input v-model="confirmPassword" type="password"></md-input>
        </md-field>
      </div>
    </div>
  </div>
</template>
